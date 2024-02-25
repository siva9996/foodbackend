const mongoose = require('mongoose')
const fooditemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    photo: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('photo', fooditemSchema)