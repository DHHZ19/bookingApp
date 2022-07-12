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

app.use('/api/Auth', require('./Auth/Route'))

app.get('/admin', adminAuth, (req,res) => res.send('user route'))

app.get('/register', (req,res) => res.render('pages/register'))
app.get('/logout', (req,res) => {
    res.cookie('jwt', '', {maxAge: '1'})
    res.redirect('/')
})
app.get("/", userAuth, (req, res) => res.render("user"));
app.get('/admin', adminAuth, (req,res) => res.render('pages/admin'))
app.get('/', (req, res) => {
    res.render('pages/index', {title: "Home Page"})
})




app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server listening on port ${PORT} `)
})