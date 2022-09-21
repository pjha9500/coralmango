const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const Restaurent= sequelize.define('restaurent', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    address:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING(100),
        allowNull: false
    },

})

module.exports =Restaurent;