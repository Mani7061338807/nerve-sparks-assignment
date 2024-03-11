const express = require('express');
const Cars = require('../models/schema')
const User = require('../models/UserSchema')
const Dealership = require('../models/DealerShipSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/user/signup',async(req,res)=>{
    const {user_id,user_email,password,user_location,name} = req.body;

    if(!user_email || !user_id || !password){
        res.status(400).send({message:"Please fill all the details"});
    }

    const existingUser = await User.findOne({user_email});
    if(existingUser){
        return res.status(401).send({message:"User aleady exits with that email!"});
    }
  // password hased 
    const hasedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        user_email:user_email,
        name,
        user_id:user_id,
        password:hasedPassword,
        user_location:user_location
    });
    
    newUser.save();
    return res.status(200).send({message: newUser});
});
router.post('/user/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const existingUser = await User.findOne({user_email:email});

        if(!existingUser){
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
router.get('/user/dealerships/:carId',async(req,res)=>{
    try {
    const {carId} = req.params;
    const car = await Cars.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Find dealerships that have the specified car in their inventory
    const dealerships = await Dealership.find({ cars: carId });

    res.status(200).json(dealerships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/user/vehicles/:userId', async (req, res) => {
    try {
      // Find the user by ID and populate the 'vehicle_info' field
      const user = await User.findById(req.params.userId).populate({
        path: 'vehicle_info',
        populate: {
          path: 'car_id',
          model: 'Cars',
          populate: {
            path: 'dealer_id',
            model: 'Dealership',
          },
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract the relevant information
      const vehiclesWithDealershipInfo = user.vehicle_info.map((vehicle) => {
        return {
          vehicle_id: vehicle._id,
          car_info: {
            type: vehicle.car_id.type,
            name: vehicle.car_id.name,
            model: vehicle.car_id.model,
            // Add other car details as needed
          },
          dealership_info: {
            name: vehicle.car_id.dealer_id.dealership_name,
            location: vehicle.car_id.dealer_id.dealership_location,
            // Add other dealership details as needed
          },
        };
      });
  
      res.status(200).json(vehiclesWithDealershipInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
router.get('/user/deals/:carId',async(req,res)=>{
    try {
        // Find the car by ID
        const car = await Cars.findById(req.params.carId);
        if (!car) {
          return res.status(404).json({ error: 'Car not found' });
        }
    
        // Find all deals related to the specified car
        const deals = await Deal.find({ car_id: req.params.carId });
    
        res.status(200).json(deals);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});
module.exports = router;