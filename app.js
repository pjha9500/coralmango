const express=require('express');
const app=express();
const sequelize=require('./utils/database');
const Restaurent=require('./models/restaurents');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/admin/addrestaurent',async(req,res,next)=>{

    const name=req.body.name;
    const address=req.body.address;
    const description=req.body.description;

    await Restaurent.create({
        name:name,
        address:address,
        description:description

    })
    res.send("data added");


    
})

app.get('/home',async(req,res,next)=>{

    const restaurents = await Restaurent.findAll();
    console.log(restaurents.length);
    let data=[];
    for(let i=0;i<restaurents.length;i++)
    {
        let obj={};
        obj["id"]=restaurents[i].id;
        obj["name"]=restaurents[i].name;
        obj["address"]=restaurents[i].address;
        data.push(obj);
    }

    res.status(200).json({data});
})
app.get('/restaurent/:id',async(req,res,next)=>{
    const id=req.params.id;
    let restaurent=await Restaurent.findByPk(id);

    console.log(restaurent.name);

    res.send("wait");

})

sequelize.sync();

app.listen(3000);