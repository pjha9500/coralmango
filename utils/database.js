const Sequelize=require('sequelize');


const sequelize=new Sequelize('coralmango','root','Pjha@11810995',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize; 