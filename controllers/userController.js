const db = require('../models')
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const config = require('config'); 




module.exports = {
  findAll: function(req, res){
    db.User
      .find({})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
  remove: function({ params: { id}}, res){
    console.log('remove controller')
    db.User
      .deleteOne( { _id: id})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByOne: function(req, res){
    console.log(req.user.id)
    db.User 
      .findById({ _id: req.user.id})
      .select('-password')
      .then(user => res.json(user))
  },
  register: function(req, res){
    const { name, email, password } = req.body; 
    if(!name || !email || !password ) res.status(400).json({msg: 'Enter all fields'})
    db.User
      .findOne({email})
      .then(user => {
        if(user) return res.status(400).json({msg: 'user already exists'})

        const newUser = {
          name, 
          email, 
          password
        }
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err; 
            newUser.password = hash; 
            db.User
              .create(newUser)
              .then(user => 
                jwt.sign(
                  { id: user.id }, 
                  config.get('SECRET'), 
                  { expiresIn: 3600 },
                  (err, token) => {
                    if(err) throw err;
                    res.json({
                      token, 
                      user:{
                        id: user.id, 
                        name: user.name
                      }
                    })
                  }
                )
              )
          })
        })
      })
  },login: function(req, res){
    const { email, password } = req.body; 
    db.User
    .findOne({email})
    .then(user => {
      if(!user) res.json(401).json({msg:"User not found"})
      console.log(user); 
      bcrypt.compare(password, user.password)
      .then(isMatch =>{
        if(!isMatch) return res.status(400).json({msg:"invalid credentials"})
        jwt.sign(
          { id: user.id }, 
          config.get('SECRET'), 
          { expiresIn: 3600 },
          (err, token) => {
            if(err) throw err;
            res.json({
              token, 
              user:{
                id: user.id, 
                name: user.name
              }
            })
          }
        )
      })
    })
  } 
}

