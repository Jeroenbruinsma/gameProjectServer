const express = require('express')
const User = require('./model')
var router = express.Router();
const bcrypt = require('bcrypt')
const {toJWT,toData} = require('./jwt')

router.post('/user', function (req, res) {
    const newUser = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        password_confirmation: bcrypt.hashSync(req.body.password_confirmation, 10)
    }
    Sser
        .create(newUser)
        .then(user => res.status(201).json({ email: user.email, id: user.id }))
        .catch(err => console.log("got an error"))
}
)

router.post('/tokens', function (req, res) {
    const email = req.body.email
    const passwd = req.body.password
    if ((email != undefined) &&( passwd != undefined) && ( passwd != "")) {
      user
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: 'User with that email does not exist(NOT SAVE!)'
          })
        }
 
        if (bcrypt.compareSync(req.body.password, entity.password)) {
 
          res.send({
            jwt: toJWT({ userId: entity.id })
          })
        }
        else {
          res.status(400).send({
            message: 'Password was incorrect'
          })
        }
      })
      .catch(err => {
        res.status(500).send({
          message: 'Something went wrong'
        })
      })
    } else {
        res.status(400).send({
            message: 'Please supply a valid email and password'
        })
    }
})

module.exports = router;