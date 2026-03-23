import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import parser from "cookie-parser"
import jwt from "jsonwebtoken"

const app = express()
const port = 57911
app.use(express.static("public"))
app.use(parser())
app.use(express.urlencoded({ extended: true }))
app.set("view engine","ejs")
mongoose.connect("mongodb://manish_vsnv:godhanumanji@ac-znxcr9k-shard-00-00.yskz3k2.mongodb.net:27017,ac-znxcr9k-shard-00-01.yskz3k2.mongodb.net:27017,ac-znxcr9k-shard-00-02.yskz3k2.mongodb.net:27017/data?ssl=true&replicaSet=atlas-58a7tt-shard-0&authSource=admin&appName=Mycluster")

const schema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/ },
    password: { type: String, required: true }

})

const user = mongoose.model("data", schema);

app.post("/signup", async (req, res) => {

    let token = jwt.sign({ email: req.body.email }, "SecretCode")
    res.cookie("token", token)
    const { name, email, password } = req.body;
    const isemail = await user.findOne({ email: email })
    if (isemail) {
        return res.send("Email Already Exists")
    }
    let p = req.body.password
    let hashpassword = await bcrypt.hash(p, 10)
    const t = new user({
        name,
        email,
        password: hashpassword
    })
    await t.save().then(() => {
        res.render("index",{title:"SignUp Done",img:"imgs/herocome.gif"})
    }).catch((err) => {
        if (err.name === "ValidationError") {
            return res.render("index",{title:"Incorrect",img:"imgs/incorrect.gif"});
        }
        res.send("Error Occured!");
    })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let checkemail = await user.findOne({ email: req.body.email })
    if(!checkemail){
       return res.render("index",{title:"Fake User",img:"imgs/fake.gif"}) 
    }
    let decrypt = await bcrypt.compare(req.body.password, checkemail.password);
    if(decrypt){
        let a = jwt.sign({email:req.body.email},"SecretToken")
        res.cookie("token",a)
        res.render("index",{title:"Login Done",img:"imgs/hero.gif"}) 
    }

    else{
        return res.render("index",{title:"Fake User",img:"imgs/fake.gif"}) 
    }
})

app.get("/read", (req, res) => {
    let verify = jwt.verify(req.cookies.token, "SecretCode");
    console.log(verify);
})
app.listen(port, () => {
    console.log(`My Server At ${port}`);
})