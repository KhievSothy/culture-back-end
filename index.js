require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const rateLimit = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const { handleError, catchMiddleware, catchInterceptor, invalidateInterceptor } 
= require('./src/middlewares/index.js')
const dbConnect = require('./src/db/db.js')
const eventRouter = require('./src/routes/event.js')
const userRouter = require('./src/routes/user.js')
const siteRouter = require('./src/routes/site.js')
const artRouter = require('./src/routes/art.js')
const museumRouter = require('./src/routes/museum.js')

const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');
const setupSwagger = require('./swagger/index.js');
const cors = require('cors');
const app = express()


dbConnect().catch((err) => {console.log(err)})
redisClient.connect()

// const limiter = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.sendCommand(args),
//     }),
//     windowMs: 1 * 60 * 1000, // 1 minutes
//     max: 30, // Limit each IP to 100 requests per windowMs
//     message: { msg: 'Too many requests from this IP, please try again later.' },
// })
// // console.log("Restart")
// const loginLimit = rateLimit({
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.sendCommand(args),
//     }),
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 5, // Limit each IP to 100 requests per windowMs
//     message: { msg: 'Too many login attampt' },
// })


passport.use(jwtStrategy)

// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)
app.use('/auth', authRouter)
//app.use('/auth', loginLimit, authRouter)
//app.use(limiter)
app.use('/files',passport.authenticate('jwt', { session: false }), fileRouter)
app.use(catchMiddleware)
app.use(catchInterceptor(30 * 60))
app.use(invalidateInterceptor)
app.use(cors());
//app.get('/sites', (req, res) => {res.json({ message: 'CORS enabled!' });});

// Router
app.use('/sites', passport.authenticate('jwt', { session: false }), siteRouter)
app.use('/events', passport.authenticate('jwt', { session: false }), eventRouter)
app.use('/users', passport.authenticate('jwt', { session: false }), userRouter)
app.use('/arts', passport.authenticate('jwt', { session: false }), artRouter)
app.use('/museums', passport.authenticate('jwt', { session: false }), museumRouter)

app.use(handleError)

setupSwagger(app)


app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})