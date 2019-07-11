const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const Game = require('./model')
const Teeth = require('../teeth/model')
const maxTeethInMouth = 3;
const Sse = require('json-sse')
const json = JSON.stringify([])

const stream = new Sse(json);
const streamForLobby = new Sse(json);


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


router.get('/lobby', auth, function (req, res, next) {
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

router.get('/lobby/:id', auth, function (req, res, next) {
    const { id } = req.params
    const playerId = req.user.dataValues.id
    console.log("Player joins game :", id)
    console.log("Whoiis the player?", playerId)

   
    Game.findOne({ where: { id } })
        .then(dbGame => {
            //console.log("dbGame", dbGame)
            newStatus = statusOfGame(dbGame.dataValues.status)
            newUsers = usersOfGame(dbGame.dataValues.userIds, playerId)
            console.log("got back", newStatus)
            dbGame.update({
                userIds: newUsers,
                status: newStatus
            })

                .then(dbgame => {
                    // console.log("dbGameW user1", dbgame)
                    //console.log("dbGameW user2", dbgame.dataValues)
                    const json = JSON.stringify(dbGame.dataValues)
                    console.log("json", json)
                    res.status(201).json(dbGame.dataValues )
                    
                })
        })

})

const usersOfGame = (currentUsersOfGame, newPlayer) => {
    console.log("currentUsersOfGame", currentUsersOfGame, newPlayer)
    //validat if is valid json here
    console.log("is valid json tester: ", IsJsonString(currentUsersOfGame))
    if (IsJsonString(currentUsersOfGame)) {
        const obj = JSON.parse(currentUsersOfGame);
        if (obj.user1 !== newPlayer) {
            return JSON.stringify({
                user1: obj.user1,
                user2: newPlayer
            })
        } else {
            return currentUsersOfGame
        }
    } else {
        //not a valid json so overwrite
        return JSON.stringify({
            user1: newPlayer,
            user2: null
        })
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const statusOfGame = (currentStatusOfGame) => {
    console.log("imp of statusofgame", currentStatusOfGame)
    switch (currentStatusOfGame) {
        case "EMPTY":
            return "WAITING"
        case "WAITING":
            return "FULL"
        case "FULL":
            return "DONE"

        default:
            return currentStatusOfGame
    }


}

router.get('/game/:id', function (req, res, next) {
    const { id } = req.params
    console.log("Player joins game :", id)
    stream.init(req, res)

    Game.findAll({ where: { id } })
        .then(dbGame => {
            const GameInfo = dbGame[0].dataValues
            console.log("std obj", GameInfo)
            Teeth.findAll({
                where: { "gameId": id },
                attributes: ['id', 'clicked', 'placeInMouth']
            })
                .then(teetGameObjecthForThisGame => {
                    const ToothInMout = teethForThisGame.map(crokiTeeth => {
                        return crokiTeeth.dataValues
                    })
                    return {
                        GameInfo,
                        ToothInMout
                    }
                })
                .then(GameObject => {
                    const json = JSON.stringify(GameObject)
                    console.log("json", json)
                    stream.updateInit(json)
                    return stream.send(json)
                })


        })

})


router.put('/teeth', auth, function (req, res, next) {
    const teethId = parseInt(req.body.teethId)
    if (teethId) {
        console.log("change click of theetid:", parseInt(req.body.teethId))
        Teeth.findOne({ where: { "id": teethId } })
            .then(result => {
                if (result == null) {
                    res.status(500).json({
                        message: 'Tooth Unknown',
                    })
                } else {
                    console.log("found the tooth, update the clickkk")
                    result.update({
                        clicked: true
                    })
                }
                return (result)
            })
            .then(result => {
                console.log("got here", result.dataValues)
                if (result.dataValues.biting) {
                    console.log("got here")
                    const id = result.dataValues.gameId
                    console.log("this tooth was biting! ", id)
                    Game.findOne({ where: { id } })
                        .then(dbGame => {
                            console.log("game to update", dbGame)
                            dbGame.update({
                                status: "DONE"
                            })
                        })
                }
                return result
            })
            .then(result => {
                //this is the new part! 
                const id = result.dataValues.gameId
                console.log("this is IMP should be a id", id)

                Game.findAll({ where: { id } })
                    .then(dbGame => {
                        const GameInfo = dbGame[0].dataValues
                        //console.log("std obj", GameInfo)
                        Teeth.findAll({
                            where: { "gameId": id },
                            attributes: ['id', 'clicked', 'placeInMouth']
                        })
                            .then(teethForThisGame => {
                                const ToothInMout = teethForThisGame.map(crokiTeeth => {
                                    return crokiTeeth.dataValues
                                })
                                return {
                                    GameInfo,
                                    ToothInMout
                                }
                            })
                            .then(GameObject => {
                                const json = JSON.stringify(GameObject)
                                //console.log("json", json)
                                stream.updateInit(json)
                                return stream.send(json)
                            })
                    })
            })

            //this is the new part!
            .catch(err => {
                res.status(500).json({
                    message: 'Tooth Unknown',
                })
                console.log('something went wrong')
            })
    } else {
        res.send("message: unknown tooth")
    }

})


module.exports = router;