const express=require('express');
const app=express();
const sequelize=require('./utils/database');
const Restaurent=require('./models/restaurents');
const Review=require('./models/reviews');
const bodyParser = require('body-parser');
const { HasMany } = require('sequelize');
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
    res.send({msg:"Restaurent Added Successfully"});


    
})

//get the list of restaurents

app.get('/home',async(req,res,next)=>{

    const restaurents = await Restaurent.findAll({attributes:['id','name','address']});
    console.log(restaurents.length);


    res.status(200).json({restaurents});
})


//restaurents data
app.get('/restaurent/:id',async(req,res,next)=>{
    const id=req.params.id;
    let restaurent=await Restaurent.findByPk(id,{attributes:['id','name','address','description']});

    console.log(restaurent);
    let reviews=await restaurent.getReviews({attributes:['id','review']});
    res.send({
        "Restaurent":restaurent,
        "Reviews":reviews
    });

})

//reviews end point part
app.post('/restaurent/:id',async(req,res,next)=>
{
    const id=req.params.id;
    let restaurent=await Restaurent.findByPk(id);
    await restaurent.createReview({
        review:req.body.review
    })
    res.send({"message":`review added Successfully for ${restaurent.name}`});

})

Restaurent.hasMany(Review)
Review.belongsTo(Restaurent);

sequelize.sync();

app.listen(3000);