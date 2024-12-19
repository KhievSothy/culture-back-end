require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const { handleError, catchMiddleware, catchInterceptor, invalidateInterceptor 
} = require('./src/middlewares/index.js')

const dbConnect = require('./src/db/db.js')
const eventRouter = require('./src/routes/event.js')
const userRouter = require('./src/routes/user.js')
const siteRouter = require('./src/routes/site.js')
const authRouter = require('./src/routes/auth.js');
const jwtStrategy = require('./src/common/strategy/jwt.js');
const redisClient = require('./src/redis/index.js');
const fileRouter = require('./src/routes/file.js');
const setupSwagger = require('./swagger/index.js');
//const cors = require('cors');
const app = express()


dbConnect().catch((err) => {console.log(err)})
redisClient.connect()
passport.use(jwtStrategy)

// app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// app.use(logger)
app.use('/auth', authRouter)
app.use('/files',passport.authenticate('jwt', { session: false }), fileRouter)
app.use(catchMiddleware)
app.use(catchInterceptor(30 * 60))
app.use(invalidateInterceptor)
//app.get('/sites', (req, res) => {res.json({ message: 'CORS enabled!' });});

// Router
app.use('/sites', passport.authenticate('jwt', { session: false }), siteRouter)
app.use('/events', passport.authenticate('jwt', { session: false }), eventRouter)
app.use('/users', passport.authenticate('jwt', { session: false }), userRouter)


app.use(handleError)

setupSwagger(app)

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`)
})