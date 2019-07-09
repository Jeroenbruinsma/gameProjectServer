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
                }else{
                    console.log("found the tooth, update the click")
                    result.update({
                        clicked: true
                    })
                    .then(tmp => {
                        if(tmp.dataValues.clicked === true ){
                            res.status(200).json({message: "done"})
                        }
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Tooth Unknown',
                })
                console.log('something went wrong')
            })
        //check if thoot is in db
        // if is. > clicked
        //send > new theeth 

    } else {
        res.send("message: unknown tooth")
    }

})

module.exports = router;