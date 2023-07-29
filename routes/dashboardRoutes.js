const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../middlewares/auth')

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user,
    recommendedCities: req.user.recommendedCities,
    notifications: req.user.notifications,
  })
})

module.exports = router
