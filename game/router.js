const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const Game = require('./model')
const Teeth = require('../teeth/model')
const maxTeethInMouth = 3;


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

router.post('/game/', auth, function (req, res) {
    console.log("get game with auth")
    const addGame = {
        gameName: req.body.gameName,
        status: "EMPTY",
        playerWinner: null,
        turn: null
    }
    Game
        .create(addGame)
        .then(game => {
            console.log("gameid  is:", game.dataValues.id)
            return game.dataValues.id

        })
        .then(gameId => {
            Teeth.findAndCountAll({ "gameID": gameId })
                .then(dbCount => console.log("dbresult", dbCount.count))
                .catch(err => res.statusCode(500).send("something went wrong"))

            const magic_theeth = getRandomInt(maxTeethInMouth)
            for (let i = 0; i < maxTeethInMouth; i++) {
                console.log("create teeth ", i)
                if (i === magic_theeth) {
                    Teeth
                        .create({
                            "gameId": gameId,
                            "biting": true
                        })
                } else {
                    Teeth
                        .create({
                            "gameId": gameId
                        })
                }
            }
            Teeth
                .create({ "gameId": gameId })
        })

    res.status(201).send({ data: "send some data to make Serena Happy" })
})


router.get('/game', auth, function (req, res, next) {
    Game.findAndCountAll()
        .then(dbCount => {
            return dbCount.rows
        })
        .then(lobbyGames => {
            res.json({ Lobby: lobbyGames })
        })
        .catch(err => res.statusCode(500).send("something went wrong"))
})

router.delete('/game/:id', auth, function (req, res) {
    const { name } = req.user.dataValues
    const { id } = req.params
    console.log(`User with ${name} tries to delete game with id: ${id}`)
    res.status(201).send({ data: "Why do you want to delete a game?" })
})


router.put('/game' , auth , function (req, res, next) {
    console.log('Please implement stream here for Serena!')

})

module.exports = router;