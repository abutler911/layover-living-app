const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://abutler911:Beth1975@cluster0.1iofkf5.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
    console.log('MongoDB connected...')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB
