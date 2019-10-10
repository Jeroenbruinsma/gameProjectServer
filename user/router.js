const express = require("express");
const User = require("./model");
const Game = require("../game/model");
var router = express.Router();
const bcrypt = require("bcrypt");

router.post("/user", function(req, res, next) {
  console.log("post user", req.body);
  if (req.body === "") {
    console.log("Error missing body info in request");

    next("error");
    throw new Error("Body Missing");
  }
  if (req.body.password === "" || req.body.password_confirmation === "") {
    console.log("Error password isnt in request");
    //res.status(401).send({"No": "Password"})
    throw new Error("Password wrong");
    next();
  }
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    password_confirmation: bcrypt.hashSync(req.body.password_confirmation, 10),
    gameId: ""
  };
  User.create(newUser)
    .then(user => res.status(201).json({ email: user.email, id: user.id }))
    .catch(err => console.log("got an error"));
});

//isnt rest
router.put("/user", function(req, res, next) {
  console.log("router form user get winner ", req.body);
  console.log("router form user get winner gameId: ", req.body.gameId);
  Game.findByPk(req.body.gameId)
    .then(winnerGame => {
      //console.log("game that has as winner:", winnerGame.dataValues);
      return winnerGame;
    })
    .then(winnerGameId => {
        //console.log('looking for:', winnerGameId.playerWinner)
      User.findByPk(winnerGameId.playerWinner) //{ where: { userId: req.user.dataValues.id } }
        .then(user => {
          res.json({ winner: user.name });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Something went wrong",
        error: err
      });
    });
});

module.exports = router;
