const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Review= sequelize.define('review', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    review:{
        type: Sequelize.STRING,
        allowNull: false
    },

})

module.exports =Review;