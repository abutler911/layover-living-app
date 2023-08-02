require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const expressLayouts = require('express-ejs-layouts')
const authRoutes = require('./routes/authRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const cityRoutes = require('./routes/cityRoutes')
const connectDB = require('./config/db')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Connect to MongoDB
connectDB()

// Express body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Express session middleware
app.use(
  session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
  }),
)

// Passport middleware
require('./config/passport')(passport) // Import the configuration file
app.use(passport.initialize())
app.use(passport.session())

// Connect flash middleware
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

// Routes
app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/cities', cityRoutes)

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Server spun up on port ${port}...`)
})
