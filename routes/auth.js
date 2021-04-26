const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()

const User = require('../models/User')

router.post('/register', async (req, res) => {
  const { name, username, password } = req.body

  // simple validation
  if (!username || !password) {
    return res.render('resigter', { message: 'please try again.' })
  }

  const passwordHash = bcrypt.hashSync(password, 10)
  const user = new User({ name, username, password: passwordHash })
  await user.save()
  req.session.user = user
  res.render('index', { ...user, title: 'nodejs-passport' })
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: 'login',
    successRedirect: '/',
  }),
  async (req, res) => {
    // const { username, password } = req.body
    return res.redirect('/')
    // const { username, password } = req.body
    // const user = await User.findOne({ username })
    // let message
    // if (user) {
    //   const isCorrect = bcrypt.compareSync(password, user.password)
    //   if (isCorrect) {
    //     req.session.user = user
    //     return res.render('index', { ...user, title: 'nodejs-passport' })
    //   } else {
    //     message = 'Username or Password incorrect'
    //   }
    // }
    // message = 'Username does not exist'
    // return res.render('login', { username, message })
  }
)

module.exports = router
