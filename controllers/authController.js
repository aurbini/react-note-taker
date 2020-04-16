const db = require('../models'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const config = require('config'); 

module.exports = {
  authorize: function(req, res){
    const { email, password } = req.body; 
    console.log(email, password)
    if( !email || !password ) res.status(400).json({msg: 'Enter all fields'})
    //check for existing User
   console.log(email)
    db.User
      .findOne({email})
      .then(user => {
        console.log(user)
        if(!user) return res.status(400).json({msg: 'User does not exist'})
        //validate password
        console.log('user email found')
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