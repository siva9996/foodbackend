const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const router = require('./Routes/Createuser')

app.use((req, res, next) => {
    console.log(req.path + ' ' + req.method)
    next()
})
const corsConfig = {
    origin: "*",
    credential: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig))

app.get('/', (req, res) => {
    res.send('hello world')
})
app.use(express.static('public/'))
app.use(express.json())
mongoose.connect(process.env.MONGODB).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('connection successful')
    })
}).catch((er) => {
    console.log(er)
})

app.use('/api/', router)