const Teeth = require('../teeth/model')
const express = require('express')
var router = express.Router();
const auth = require('../login/middleware')

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

module.exports = router;