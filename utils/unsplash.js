const axios = require('axios')

const fetchCityImage = async (cityName) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${cityName}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
    )
    return response.data.urls.regular
  } catch (error) {
    console.error(error)
  }
}

module.exports = fetchCityImage
