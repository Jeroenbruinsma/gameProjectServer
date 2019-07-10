const Teeth = require('../teeth/model')
const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')
const Game = require('../game/model')
const Sse = require('json-sse')
const {stream }= require('../game/router')

//const json = JSON.stringify([])
//const stream = new Sse(json);

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
                    console.log("found the tooth, update the clickkk",result)
                    result.update({
                        clicked: true
                    })
                        .then(tmp => {
                            if (tmp.dataValues.clicked === true) {
                                //stream inplementation
                                console.log("MIMI WAUW", tmp.dataValues)
                                const json = JSON.stringify(tmp.dataValues)
                                stream.updateInit(json)
                                stream.send(json)
                                console.log("stream send",stream)
                            }
                            //stream inplementation 
                            res.status(200).json({ message: "done" })

                        })
                }
            })
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