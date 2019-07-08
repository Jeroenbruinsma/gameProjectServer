const express = require('express')
const User = require('./model')
var router = express.Router();
const bcrypt = require('bcrypt')
const { toJWT, toData } = require('./jwt')

router.post('/user', function (req, res) {
    console.log("post user", req.body)

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        password_confirmation: bcrypt.hashSync(req.body.password_confirmation, 10),
        gameId: ""
    }
    User
        .create(newUser)
        .then(user => res.status(201).json({ email: user.email, id: user.id }))
        .catch(err => console.log("got an error"))
}
)

module.exports = router;