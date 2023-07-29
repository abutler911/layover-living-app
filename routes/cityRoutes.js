const express = require('express')
const axios = require('axios')
const router = express.Router()
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth')
const City = require('../models/City')
const fetchCityImage = require('../utils/unsplash')

// Display a list of all cities
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Fetching cities...')
    let cities = await City.find({})
    console.log(`Fetched ${cities.length} cities`)

    // Fetch an image for each city
    console.log('Fetching images for each city...')
    cities = await Promise.all(
      cities.map(async (city) => {
        console.log(`Fetching image for city: ${city.name}`)
        const imageUrl = await fetchCityImage(city.name)
        console.log(`Fetched image for city: ${city.name}`)
        return {
          ...city._doc,
          imageUrl: imageUrl,
        }
      }),
    )
    console.log('Fetched images for all cities')

    console.log('Rendering citiesList view...')
    res.render('citiesList', { cities: cities })
    console.log('Rendered citiesList view')
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
  const city = await City.findById(req.params.cityId)
  res.render('cities/show', { city: city })
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
