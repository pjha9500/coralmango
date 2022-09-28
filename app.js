const express=require('express');
const app=express();
const sequelize=require('./utils/database');
const Restaurent=require('./models/restaurents');
const Review=require('./models/reviews');
const User=require('./models/user');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const { HasMany } = require('sequelize');



app.use(bodyParser.json());

//user signup
app.post('/user/signup',async(req,res,next)=>{
    console.log(req.body.name);
    let name=req.body.name;
    let email=req.body.email;
    let password=bcrypt.hashSync(req.body.password,10);
    try{
        await User.create({
        name:name,
        email:email,
        password:password
    })

    }
    catch (err)
    {
        res.json({msg:err});
    }
    res.json({msg:"Sign up Successfull"});

 //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   
 
})
//user login
app.post('/user/login',async(req,res,next)=>{
    let email=req.body.email;
    let password=req.body.password;

    let user=await User.findAll({where:{email:email}});
    if(user.length==0)
    {
        res.json({msg:"User doesn't exist"});
    }
    else{

        let pass=bcrypt.compareSync(password,user[0].password);
        if(true)
        {
            const token = jwt.sign(user[0].id, "Prabhat")
            res.status(200).json({msg:'Login successful', token: token});
        }
        else{
            res.status(401).json({msg:"invalid password"});
        }
    }


})
//add resturant
app.post('/admin/addrestaurant',async(req,res,next)=>{

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
app.get('/restaurant/:id',async(req,res,next)=>{
    const id=req.params.id;
    let restaurent=await Restaurent.findByPk(id,{attributes:['id','name','address','description']});

    console.log(restaurent);
    let reviews=await restaurent.getReviews({attributes:['id','review']});
    res.send({
        "Restaurant":restaurent,
        "Reviews":reviews
    });

})

//reviews end point part
app.post('/restaurant/:id',async(req,res,next)=>
{
    let token=req.headers.authorization;
    token=token.slice(7,token.length);
    let userid=jwt.verify(token,"Prabhat");
    console.log(userid);
    let user=await User.findByPk(userid);
    console.log(user);
    if(user)
    {
        const id=req.params.id;
        let restaurent=await Restaurent.findByPk(id);
        await restaurent.createReview({
            review:req.body.review,
            userId:user.id
            
    })
    res.send({"message":`review added Successfully for `});
    }
    else{
        res.send({msg:"Unauthorized"});
    }
    

})

app.get('/admin',async(req,res,next)=>{

    let restaurents=await Restaurent.findAll();
    let data=[];

    for(let i=0;i<restaurents.length;i++)
    {
        let obj={};
        let reviews= await restaurents[i].getReviews();
        obj['id']=`${restaurents[i].id}`
        obj['Restaurant Name']=`${restaurents[i].name}`;
        obj['Total Reviews']=`${reviews.length}`;
        data.push(obj);

    }
    res.json({data});

})
User.hasMany(Review);
Review.belongsTo(User);

Restaurent.hasMany(Review)
Review.belongsTo(Restaurent);

sequelize.sync();

app.listen(3000);