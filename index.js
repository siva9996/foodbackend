const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./Routes/Createuser')

app.use((req, res, next) => {
    console.log(req.path + ' ' + req.method)
    next()
})
app.use(cors())
app.get('/', (req, res) => {
    res.send('hello world')
})
app.use(express.static('public/'))
app.use(express.json())
mongoose.connect('mongodb+srv://rmsiva9996:LzwSkUHEP5FGP6BB@cluster0.ss1xdqe.mongodb.net/').then(() => {
    app.listen(5000, () => {
        console.log('connection successful')
    })
}).catch((er) => {
    console.log(er)
})

app.use('/api/', router)