const express = require('express')

const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 3001
const routes = require('./routes')

const bcrypt = require('bcryptjs')
const jwtf = require('jsonwebtoken')

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

app.use(routes)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/note-taker',
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
)

app.listen(PORT, function(){
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
})