const Teeth = require('../teeth/model')
const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const Game = require('../game/model')

router.get('/teeth', auth, function (req, res, next) {
    Teeth.findAll()    //{ where: { userId: req.user.dataValues.id } }
        .then(theethInMouth => {
            res.json({ mouth: theethInMouth })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
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
                    console.log("found the tooth, update the clickkk", result)
                    result.update({
                        clicked: true
                    })


                }
                return (result)
            })
            .then(result => {
                //this is the new part! 
                const id = result.dataValues.gameId
                console.log("this is IMP should be a id", id)

                Game.findAll({ where: { id } })
                    .then(dbGame => {
                        const GameInfo = dbGame[0].dataValues
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
                                console.log("json", json)
                                console.log("is stream ", stream)
                                stream.updateInit(json)
                                stream.send(json)
                                return res.send(GameObject)
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