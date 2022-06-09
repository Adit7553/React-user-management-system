// use express.js
const express = require("express")
const app = express();

// we are using cors npm package here
const cors = require("cors")
const bodyParser = require("body-parser")
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

// importing userSchema from model folder
const userSchema = require("./model/userSchema")


//connect to mongo
const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/mern-app-react-database", {
    useNewUrlParser:true,
    useUnifiedtopology:true
}).then(()=>{
 console.log("Database connection is established successfully");
}).catch(()=>{
    console.log("There is a problem occurs while connecting to the database");
})


// listen the server
const port = process.env.port || 9000
app.listen(port, ()=>{
    console.log(`Server is successfully running at ${port}`);
})


// Routes 

app.get("/", (req,res)=>{
    res.send("hello i am working now, keep it up")
})

app.post("/login", async(req,res)=>{
    const {email, password} = req.body
    userSchema.findOne({email:email}, (err,user)=>{
        if(user){
           if(password === user.password){
               res.send({message : "login successfull", user: user})

           }else{
               res.send({message : "Incorrect email id or password !"})
           }
        }else{
            res.send({message : "Incorrect email id or password !"})
            console.log("User not found in the database");
        }
    })
})


app.post("/register", (req,res)=>{
    const {name, email, mobile, city, password} = req.body
    userSchema.findOne({email: email}, (err,user)=>{
        if(user){
            res.send({message : "User already exist with this email id"})
            console.log("User already exist with this email id");
        }else{
            const user = new userSchema({
                name : name,
                email : email,
                mobile : mobile,
                city : city,
                password : password
            })
            user.save().then(()=>{
                res.send({message : "User registerd successfully"})
            }).catch((err)=>{
                res.send(err)
                res.send({message : err})
                console.log("Sorry there is a error occurd", err);
            }) 
        }
    })   
})
