const usermodel = require('../model/User')
const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtsecret = "hihelloiamsivanesan"
const adminmiddleware = require('../middleware/fooditem')
const Foodmodel = require('../model/Fooditem')
router.post('/createuser', [
    body('email').isEmail(),
    body('name', 'Name length does not meet').isLength({ min: 5 }),
    body('password', 'Password length does not meet').isLength({ min: 5 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const salt = await bcrypt.genSalt(10);
        const secpassword = await bcrypt.hash(req.body.password, salt)
        try {
            await usermodel.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: secpassword
            })
            res.json({ success: true })
        } catch (error) {
            res.json({ success: false })
        }
    })
router.post('/login', async (req, res) => {
    if (req.body.ad) {
        if (req.body.email === 'admin@gmail.com') {
            try {
                const user = await usermodel.findOne({
                    email: req.body.email
                })
                if (!user) {
                    return res.status(400).json({ err: "user not found" })
                }
                const pwdcompare = await bcrypt.compare(req.body.password, user.password)
                console.log(pwdcompare)
                if (!pwdcompare) {
                    return res.status(400).json({ err: "Incorrect credential" })
                } else {
                    const data = {
                        user1: {
                            id: user.id
                        }
                    }
                    const authToken = jwt.sign(data, jwtsecret)
                    res.status(200).json({ success: true, authToken: authToken })
                }
            } catch (error) {
                res.status(400).json({ success: false })
            }
        }
        else {
            return res.status(400).json({ err: "Incorrect credential" })
        }
    } else {
        try {
            const user = await usermodel.findOne({
                email: req.body.email
            })
            if (!user) {
                return res.status(400).json({ err: "user not found" })
            }
            const pwdcompare = await bcrypt.compare(req.body.password, user.password)
            console.log(pwdcompare)
            if (!pwdcompare) {
                return res.status(400).json({ err: "Incorrect credential" })
            }
            const data = {
                user1: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtsecret)
            res.json({ success: true, authToken: authToken })
        } catch (error) {
            res.status(400).json({ success: false })
        }
    }
})
router.post('/admin', adminmiddleware.single('fdphoto'), async (req, res) => {
    try {
        await Foodmodel.create({ name: req.body.fdname, photo: req.file.filename, price: req.body.fdprice })
        return res.status(200).json({ success: true })
    } catch (er) {
        return res.status(400).json({ success: false })
    }
})
router.get('/admin', async (req, res) => {
    try {
        const fditem = await Foodmodel.find()
        return res.status(200).json(fditem)
    } catch (er) {
        return res.status(400).json({ success: false })
    }
})
router.get('/admin/:id', async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const fditem = await Foodmodel.find({ _id: id })
        return res.status(200).json(fditem)
    } catch (er) {
        return res.status(400).json({ success: false })
    }
})
module.exports = router