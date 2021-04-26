const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
require('./db')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const User = require('./models/User')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'my_super_secret',
    resave: false,
    saveUninitialized: false,
  })
)

passport.use(
  new LocalStrategy((username, password, cb) => {
    User.findOne({ username }, (err, user) => {
      if (err) return cb(err)
      if (!user) return cb(null, false)
      if (bcrypt.compareSync(password, user.password)) return cb(null, user)
      return cb(null, false)
    })
  })
)
passport.serializeUser((user, cb) => cb(null, user._id))
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
})
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
