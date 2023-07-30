const express = require('express')
const axios = require('axios')
const router = express.Router()
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth')
const City = require('../models/City')
const fetchCityImage = require('../utils/unsplash')

// Display a list of all cities
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const search = req.query.search || ''

    let cities = await City.find({
      name: new RegExp(search, 'i'), // Case-insensitive search
    }).sort('name')

    // Fetch an image for each city
    cities = await Promise.all(
      cities.map(async (city) => {
        const imageUrl = await fetchCityImage(city.name)
        return {
          ...city._doc,
          imageUrl: imageUrl,
        }
      }),
    )

    // Check if the request is an AJAX request
    if (req.xhr) {
      // If it is, respond with JSON
      res.json({ cities: cities })
    } else {
      // If it's not, render the view
      res.render('citiesList', { cities: cities })
    }
  } catch (err) {
    console.error('Error in /cities route handler:', err)
    res.status(500).send('Server error')
  }
})

// Render form to add a new city
router.get('/add', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render('addCity')
})

// Add a new city
router.post('/add', ensureAuthenticated, ensureAdmin, (req, res) => {
  const newCity = new City(req.body)
  newCity
    .save()
    .then((city) => {
      res.redirect('/dashboard')
    })
    .catch((err) => {
      console.log(err)
      res.redirect('/dashboard')
    })
})

// Display detailed information about a specific city
router.get('/:cityId', ensureAuthenticated, async (req, res) => {
  try {
    const cityId = req.params.cityId
    const city = await City.findById(cityId).populate(
      'comments.madeBy',
      'username',
    )

    // You might also fetch an image for the city here if needed
    const imageUrl = await fetchCityImage(city.name)

    res.render('showCity', { city: city, imageUrl: imageUrl })
  } catch (err) {
    console.error('Error fetching city:', err)
    res.status(500).send('Server error')
  }
})

// Render form to edit a city's details
router.get('/:cityId/edit', ensureAuthenticated, async (req, res) => {
  const city = await City.findById(req.params.cityId)
  res.render('cities/edit', { city: city })
})

// Update a city's details
router.put('/:cityId', ensureAuthenticated, async (req, res) => {
  const updatedCity = await City.findByIdAndUpdate(
    req.params.cityId,
    req.body,
    { new: true },
  )
  res.redirect(`/cities/${updatedCity._id}`)
})

module.exports = router
