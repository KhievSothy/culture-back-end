require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');

const { logger, handleError, verifyJWT, handleValidation, } = require('./src/middlewares/index.js')

const dbConnect = require('./src/db/db.js')
const bookRouter = require('./src/routes/book.js')
const userRouter = require('./src/routes/user.js')
const courseRouter = require('./src/routes/course.js')
const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');
const app = express()

dbConnect().catch((err) => {
    console.log(err)
})
redisClient.connect()

passport.use(jwtStrategy)

// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)

app.use('/auth', authRouter)


// Router
app.use('/courses', passport.authenticate('jwt', { session: false }), courseRouter)
app.use('/books', verifyJWT, bookRouter)
app.use('/users', verifyJWT, userRouter)
app.use('/files', fileRouter)

app.use(handleError)


app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})