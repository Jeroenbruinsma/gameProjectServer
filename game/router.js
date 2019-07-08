const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')


router.post('/game/:id', auth, function (req, res) {
  console.log("get game with auth") 
  res.status(401).send({ data: "send some data to make Serena Happy"})
})
module.exports = router;