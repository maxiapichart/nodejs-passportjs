const express = require('express')
const router = express.Router()

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  res.redirect('/login')
}

router.get('/', isLoggedIn, (req, res, next) => {
  res.render('index', { title: 'nodejs-passport', user: req.user })
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
