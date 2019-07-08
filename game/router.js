const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const teeth = require('../teeth/model')

router.post('/game/:id', auth, function (req, res) {
  console.log("get game with auth") 
  res.status(201).send({ data: "send some data to make Serena Happy"})
})

router.delete('/game/:id', auth , function (req,res){
    const {name } =   req.user.dataValues
    const {id} = req.params
    console.log(`User with ${name} tries to delete game with id: ${id}`)
    res.status(201).send({ data: "Why do you want to delete a game?"})
})

module.exports = router;