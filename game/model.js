const Sequelize = require('sequelize')
const sequelize = require('../db')
const Teeth = require('../teeth/model')

const Game = sequelize.define('game', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },
    userIds: {
        type: Sequelize.STRING,
        allowNull: true
    },
    gameName: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['EMPTY', 'FULL','WAITING','DONE']]
        }
    },
    playerWinner: {
        type: Sequelize.STRING,
        
    },
    turn: {
        type: Sequelize.INTEGER
    }
}, {
        timestamps: false,
        tableName: 'game'
    })
    Game.hasMany(Teeth)
module.exports = Game