const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const Game = require('./model')
const Teeth = require('../teeth/model')
const maxTeethInMouth = 4;
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
            for (let i = 0; i <= maxTeethInMouth + 1; i++) {
                console.log("create teeth ", i)
                if (i === magic_theeth) {
                    Teeth
                        .create({
                            "gameId": gameId,
                            "biting": true,
                            "placeInMouth": i
                        })
                } else {
                    Teeth
                        .create({
                            "gameId": gameId,
                            "placeInMouth": i
                        })
                }
            }


        })
        .then(notNeeded => {
            //new code! 
            Game.findAndCountAll()
                .then(dbCount => {
                    return dbCount.rows
                })
                .then(lobbyGames => {
                    res.json({ Lobby: lobbyGames })
                })
                .catch(err => res.statusCode(500).send("something went wrong"))
        })
    //new code!
    //res.status(201).send({ data: "send some data to make Serena Happy" })
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
            console.log("dbGame", dbGame.dataValues)
            newStatus = statusOfGame(dbGame.dataValues.status)
            newUsers = usersOfGame(dbGame.dataValues.userIds, playerId)
            console.log("got back", newStatus)
            dbGame.update({
                userIds: newUsers,
                status: newStatus
            })

                .then(dbgame => {
                    const playerObject = JSON.parse(dbGame.dataValues.userIds);
                    console.log("dbGameW user1", playerObject.user1) 
                    console.log("dbGameW user2", playerObject.user2)
                    console.log("dbGameW playerId", playerId)
                    if (playerObject.user1 === playerId || playerObject.user2 === playerId) {
                        console.log('the player is in the requested game')
                        const json = JSON.stringify(dbGame.dataValues)
                        console.log("json", json)
                        res.status(201).json({ JoinGame: dbGame.dataValues.id })
                    }if(playerObject.user2 === null ){
                        console.log('the player is in the requested game')
                        playerObject.user2 = playerId;
                        const json = JSON.stringify(playerObject)
                        console.log("json", json)
                        res.status(201).json({ JoinGame: dbGame.dataValues.id })
                    }
                    else {
                        console.log('the player is NOT NO NOT in the requested game')
                       
                       
                        const json = JSON.stringify(dbGame.dataValues)
                        res.status(201).json({ command: "reload" })
                    }

                })
        })

})

const usersOfGame = (currentUsersOfGame, newPlayer) => {
    console.log("currentUsersOfGame", currentUsersOfGame, newPlayer)
    //validat if is valid json here
    console.log("is valid json tester: ", IsJsonString(currentUsersOfGame))
    if (IsJsonString(currentUsersOfGame) && currentUsersOfGame != null) {
        const obj = JSON.parse(currentUsersOfGame);
        if (obj.user1 !== newPlayer && obj.user1 === null) {
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
            Teeth.findAll({
                where: { "gameId": id },
                order: [['placeInMouth', 'DESC']],
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
                    console.log('GET /game/:id test:', json)
                    stream.updateInit(json)
                    stream.send(json)
                    //res.send(GameObject)//
                })


        })

})


router.put('/teeth', auth, function (req, res, next) {
    console.log('\n\n\n\n\nreq.body test:', req.body)
    const teethId = parseInt(req.body.teethId)
    if (teethId) {
        Teeth
            .findOne({ where: { "id": teethId } })
            .then(result => {
                if (result == null) {
                    res.status(500).json({
                        message: 'Tooth Unknown',
                    })
                } else {
                    console.log("found the tooth, update the clickkk")
                    result
                        .update({
                            clicked: true
                        })
                        .then(result => {
                            return Game
                                .findByPk(result.gameId)
                                .then(game => {
                                    console.log("game to update", game.dataValues)
                                    if (result.dataValues.biting) {
                                        console.log('tooth was biting:', result.dataValues)
                                        return game.update({
                                            status: "DONE",
                                            playerWinner: req.user.dataValues.id
                                        })
                                    } else {
                                        console.log('tooth was not biting:', result.dataValues)
                                        return game
                                    }
                                })
                        })
                        .then(game => {
                            const GameInfo = game.dataValues
                            //console.log("std obj", GameInfo)
                            Teeth
                                .findAll({
                                    where: { gameId: game.id },
                                    order: [['placeInMouth', 'DESC']],
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
                                    console.log('PUT /teeth test:', json)
                                    stream.updateInit(json)
                                    stream.send(json)
                                    return res.send(GameObject)
                                })
                        })

                } //end of else thoot exists 
            })  //i hope this the end of the .then
            .catch(err => {
                res.status(500).json({
                    message: 'Tooth Unknown',
                })
                console.log('something went wrong', err)
            })
    } else {
        res.send("message: unknown tooth")
    }

})


module.exports = router;