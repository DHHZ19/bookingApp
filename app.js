const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose')
dotenv.config();

const PORT = 8000
let mongoDB = process.env.DB_STRING
let db = mongoose.connection
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', console.error.bind(console, 'MongoDb connection error:'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index', {title: "Home Page"})
})




app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server listening on port ${PORT} `)
})