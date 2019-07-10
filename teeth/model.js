const Sequelize = require('sequelize')
const sequelize = require('../db')
const Game = require('../game/model')


const Teeth = sequelize.define('teeth', {
    gameId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    clicked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    biting: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    placeInMouth: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
        timestamps: false,
        tableName: 'teeth'
    })
    //Teeth.belongsTo(Game) not needed??
module.exports = Teeth