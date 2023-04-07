import express from "express"
import cors from "cors"


const users = []

const tweets = []

const app = express()
app.use(cors())
app.use(express.json())

app.post("/sign-up",(req,res)=>{

    const user = req.body

    if(typeof(user.username) !== "string" || typeof(user.avatar) !== "string" || user.username.length == 0 || user.avatar.length == 0){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    users.push(user)
    res.status(201).send("OK")
})

app.post("/tweets",(req,res)=>{
    const tweet = req.body

    const { user } = req.headers


    if(typeof(user) !== "string" || typeof(tweet.tweet) !== "string" || user.length == 0 || tweet.tweet.length == 0){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    if(users.some((u)=> u.username === user)){

        tweets.push({...tweet,username:user})
        res.status(201).send("OK")

    } else {
        res.status(401).send("UNAUTHORIZED")
    }
})

app.get("/tweets",(req,res)=>{

    let { page } = req.query

    if(page === undefined) page = 1;

    if(page < 1){
        res.status(400).send("Informe uma página válida!")
    }

    let feed = tweets

    if(feed.length > 10){
        feed = feed.reverse().slice(10*(page-1),10*page)
    } 

    feed = feed.map((t) =>{

        const user = users.find((u)=> u.username == t.username)

        return {...t, avatar: user.avatar}

    })

    res.status(200).send(feed)
})


app.get("/tweets/:username",(req,res)=>{

    const {username} = req.params

    console.log(username)

    const user = users.find((u) => u.username === username)

    let userTweets = tweets.filter((t) => t.username === username)

    userTweets = userTweets.map((t) => {
        
        if(t.username === username){
            return {...t,avatar:user.avatar}
        }
    })

    console.log(userTweets)
    res.status(200).send(userTweets)
})



const PORT = 5000;
app.listen(PORT,()=>{console.log(`Servidor rodando na porta ${PORT}`)})