require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const expressLayouts = require('express-ejs-layouts')
const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')

// Connect to MongoDB
connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Server spun up on port ${port}...`)
})
