const express = require('express')
const router = express.Router()
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')

// GET routes
// Register
router.get('/register', (req, res) => {
  res.render('register', { formData: {} })
})

// Login
router.get('/login', (req, res) => {
  res.render('login')
})

// POST routes
// Register
router.post(
  '/register',
  [
    // Validate the user input
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('register', { errors: errors.array(), formData: req.body })
      return
    }

    const { firstName, lastName, email, username, password } = req.body
    User.register(
      new User({ firstName, lastName, email, username }),
      password,
      function (err, user) {
        if (err) {
          console.log(err)
          res.render('register', {
            errors: [{ msg: err.message }],
            formData: req.body,
          })
        } else {
          // User was saved successfully, redirect to login page
          res.redirect('/login')
        }
      },
    )
  },
)

// Login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
)

module.exports = router
