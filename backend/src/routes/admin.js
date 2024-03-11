const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const Admin = require('../models/AdminSchema');

router.post('/admin/signup',async(req,res)=>{
    const {admin_id,password} = req.body;

    if(!admin_id || !password){
        res.status(400).send({message:"Please fill all the details"});
    }

    const existingAdmin = await Admin.find({admin_id});
    if(existingAdmin.length != 0){
      console.log(existingAdmin,admin_id);
        return res.status(401).send({message:"User aleady exits with that email!"});
    }
  // password hased 
    const hasedPassword = await bcrypt.hash(password,10);
    const newUser = new Admin({
        admin_id,
        password:hasedPassword,
    });
    
    newUser.save();
    return res.status(200).send({message: newUser});
});
router.post('/admin/login',async(req,res)=>{
    try {
        const {admin_id,password} = req.body;
        const existingAdmin = await Admin.findOne({admin_id});

        if(existingAdmin.length === 0){
            return res.status(401).send({message:"Invalid email"});
        }
        const isMachedPass = await bcrypt.compare(password,existingAdmin.password);
        if(!isMachedPass){
            return res.status(401).send({message:"Invalid  password!"});
        }
        //create token 
        const token = jwt.sign({
            data: existingAdmin._id
          }, 'majdjsajdh', { expiresIn: '1d' });
          
          res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true, // HTTP only, to prevent JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
          });
        return res.status(200).send({message:"succefully logged in",token:token,Admin:existingAdmin});
      } catch (error) {
        console.log("something went worng",error)
      }
});
module.exports=router;