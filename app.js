const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config();
const cookieParser = require('cookie-parser')
const {adminAuth, userAuth} = require('./middleware/auth')
const PORT = 8000

let mongoDB = process.env.DB_STRING
let db = mongoose.connection
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true})

db.on('error', console.error.bind(console, 'MongoDb connection error:'))

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')
//Routes
app.use("/api/auth", require("./Auth/route"));
app.get('/', (req, res) => {
    res.render('pages/index', {title: "Home Page"})
})
app.get('/register', (req,res) => res.render('pages/register'))

app.get('/login', (req,res) => res.render('pages/login'))


app.get('/logout', (req,res) => {
    res.cookie('jwt', '', {maxAge: '1'})
    res.redirect('/')
})
app.get("/basic", userAuth, (req, res) => res.render("pages/user"));
app.get('/admin', adminAuth, (req,res) => res.render('pages/admin'))




app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server listening on port ${PORT} `)
})