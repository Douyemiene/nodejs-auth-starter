const express = require('express')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.listen(3000, () => {
    console.log('listening 3000')
})

app.use(authRoutes)

//PASSWORD minimum length