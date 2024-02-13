const express = require('express')
const mongoose = require('mongoose')
const app = express()
const helmet = require("helmet")
const morgan = require("morgan")
const userRout = require('./routes/users')
const authRout = require('./routes/auth')
const postsRout = require('./routes/posts')
const dotenv = require('dotenv')

require('dotenv').config();

// mid 
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/users', userRout)
app.use('/api/auth', authRout)
app.use('/api/posts', postsRout)


app.get('/', (req, res) => {
    res.json('hello')
})


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

const port = 4000
app.listen(port, console.log(`server run at ${port}`))


