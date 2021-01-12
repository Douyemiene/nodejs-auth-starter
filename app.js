const express = require('express')
const authRoutes = require('./routes/auth')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.listen(process.env.PORT)

app.use(authRoutes)