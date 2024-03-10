const express = require('express');
const router = express.Router();
const Admin = require('../models/schema');

router.post('/admin/signup',async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).send({message:"Please fill all the details"});
    }

    const existingAdmin = await Admin.findOne({email});
    if(existingAdmin){
        return res.status(401).send({message:"User aleady exits with that email!"});
    }
  // password hased 
    const hasedPassword = await bcrypt.hash(password,10);
    const newUser = new Admin({
        email,
        password:hasedPassword,
    });
    
    newUser.save();
    res.status(200).send({message: newUser});
});
router.post('/admin/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const existingAdmin = await Admin.findOne({email});
        if(!existingAdmin){
            return res.status(401).send({message:"Invalid email"});
        }
        const isMachedPass = await bcrypt.compare(password,existingUser.password);
        if(!isMachedPass){
            return res.status(401).send({message:"Invalid  password!"});
        }
        //create token 
        const token = jwt.sign({
            data: existingUser._id
          }, 'majdjsajdh', { expiresIn: '1d' });
          
          res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true, // HTTP only, to prevent JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
          });
        return res.status(200).send({message:"succefully logged in",token:token,user:existingUser});
      } catch (error) {
        console.log("something went worng")
      }
});
module.export=router;