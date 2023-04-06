import express from "express"
import cors from "cors"


const users = [{
    	username: 'bobesponja', 
    	avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png" 
    }]

const tweets = [{
	username: "bobesponja",
    tweet: "Eu amo hambúrguer de siri!"
}]

const app = express()
app.use(cors())
app.use(express.json())

app.post("/sign-up",(req,res)=>{

    const user = req.body

    users.push(user)

    res.status(201).send("OK")
})

app.post("/tweets",(req,res)=>{
    const tweet = req.body

    if(users.some((u)=> u.username === tweet.username)){

        console.log(tweet)
        tweets.push(tweet)

        res.status(200).send("OK")

    } else {
        res.status(401).send("UNAUTHORIZED")
    }
})

app.get("/tweets",(req,res)=>{

    const feed = tweets.map((t) =>{

        const user = users.find((u)=> u.username == t.username)

        return {...t, avatar: user.avatar}

    })

    res.status(200).send(feed)
})

const PORT = 5000;
app.listen(PORT,()=>{console.log(`Servidor rodando na porta ${PORT}`)})