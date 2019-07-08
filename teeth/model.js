const Sequelize = require('sequelize')
const sequelize = require('../db')


const Users = sequelize.define('teeth', {
    gameId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clicked: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    biting: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    placeInMouth: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
}, {
        timestamps: false,
        tableName: 'teeth'
    })

module.exports = Users