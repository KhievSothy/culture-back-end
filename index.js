require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');

const { logger, handleError, verifyJWT, handleValidation, } = require('./src/middlewares/index.js')

const dbConnect = require('./src/db/db.js')
const eventRouter = require('./src/routes/event.js')
const userRouter = require('./src/routes/user.js')
const siteRouter = require('./src/routes/site.js')
const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
//const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');
const app = express()

dbConnect().catch((err) => {
    console.log(err)
})
//redisClient.connect()

passport.use(jwtStrategy)

// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)

app.use('/auth', authRouter)


// Router
app.use('/sites', passport.authenticate('jwt', { session: false }), siteRouter)
app.use('/events', verifyJWT, eventRouter)
app.use('/users', verifyJWT, userRouter)
app.use('/files', fileRouter)

app.use(handleError)


app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})