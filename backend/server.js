const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer')
const crypto = require('crypto')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
})

const JWT_SECRET = process.env.JWT_SECRET;

const app = express()

const uri = 'mongodb://localhost:27017/form'

const connection = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

const User = mongoose.model('user', userSchema)

app.use(express.json())
app.use(cors())

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password){
        return res.status(400).json({ message: "All fields are required."})
    }

    let existingUser = await User.findOne({ username }) // Check whether potentially the username is already in use.
    if (existingUser) {
        return res.status(409).json({ message: "Username already used." })
    }

    existingUser = await User.findOne({ email }) // Check whether potentially the email is already in use.
    if (existingUser) {
        return res.status(409).json({ message: "Email already used." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({username, email, password: hashedPassword})
    await newUser.save()

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({ message: "SUCCESS", token: token })
})

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        return res.status(401).json({ message: "Invalid email or password." })
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({ message: "SUCCESS", token: token })
})

app.post("/api/forgotpassword", async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    console.log(email, user)
    if (!user) {
        return res.status(400).json({ message: "User with this email does not exist." })
    }

    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60*15*1000; // 15 mins from now
    await user.save()

    const resetURL = `http://localhost:5173/changepassword/${token}`

    await transporter.sendMail({
        to: email,
        from: 'noreply@form.com',
        subject: 'Password Reset',
        html: `Hi <b>${user.username}</b>! We saw you forgot your password. You can now change your password to a new one: <br> <a href=${resetURL} style="margin-left: calc(50% - 90px); border-radius: 8px; background-color: rgb(0, 132, 255); text-decoration: none; font-size: 1rem; padding-left: 10px; padding-right: 10px; padding-top: 8px; padding-bottom: 8px; text-decoration: none; line-height: 80px; color: black;">Reset your Password</a>`
    })


    console.log("send email")
    
    res.status(200).json({ message: "SUCCESS", token: token })
})

app.post("/api/changepassword/:token", async (req, res) => {
    const { token } = req.params
    console.log(token)
    const { password } = req.body
   
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user){
        return res.status(400).json({ message: "The reset password session is invalid or expired." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    
    res.status(200).json({ message: "SUCCESS", token: token })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000...")
})