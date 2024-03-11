const express = require('express');
const Dealership = require('../models/DealerShipSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/dealership/signup',async(req,res)=>{
    const {dealership_email,dealership_id,name,password,Location} = req.body;

    if(!dealership_email || !dealership_id || !password){
        res.status(400).send({message:"Please fill all the details"});
    }

    const existingUser = await Dealership.findOne({dealership_email});
    if(existingUser){
        return res.status(401).send({message:"User aleady exits with that email!"});
    }
  // password hased 
    const hasedPassword = await bcrypt.hash(password,10);
    const newUser = new Dealership({
        dealership_email:dealership_email,
        dealership_id:dealership_id,
        password:hasedPassword,
        dealership_location:Location,
        name:name
    });
    
    newUser.save();
    return res.status(200).send({message: newUser});
});
router.post('/dealership/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const existingDealer = await Dealership.findOne({dealership_email:email});

        if(!existingDealer){
            return res.status(401).send({message:"Invalid email"});
        }
        const isMachedPass = await bcrypt.compare(password,existingDealer.password);
        if(!isMachedPass){
            return res.status(401).send({message:"Invalid  password!"});
        }
        //create token 
        const token = jwt.sign({
            data: existingDealer._id
          }, 'majdjsajdh', { expiresIn: '1d' });
          
          res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            httpOnly: true, // HTTP only, to prevent JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
          });
        return res.status(200).send({message:"succefully logged in",token:token,user:existingDealer});
      } catch (error) {
        console.log("something went worng")
      }
});
router.post('/dealerships/:dealershipId/addCar',async(req,res)=>{
    try {
        const dealershipId = req.params.dealershipId;
    
        // Find the dealership by ID
        const dealership = await Dealership.findById(dealershipId);
    
        if (!dealership) {
          return res.status(404).json({ error: 'Dealership not found' });
        }
    
        // Assuming request body contains details of the new car
        const { type, name, model, car_info } = req.body;
    
        // Create a new car instance
        const newCar = new Cars({
          type,
          name,
          model,
          car_info,
        });
    
        // Save the new car to the Cars collection
        await newCar.save();
    
        // Update the dealership to include the new car in their list
        await dealership.updateOne({ $push: { cars: newCar._id } });
    
        res.json({ success: true, message: 'Car added to the dealership successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});
router.post('/dealerships/:dealershipId/addDeal', async (req, res) => {
    try {
      const dealershipId = req.params.dealershipId;
  
      // Find the dealership by ID
      const dealership = await Dealership.findById(dealershipId);
  
      if (!dealership) {
        return res.status(404).json({ error: 'Dealership not found' });
      }
  
      // Assuming request body contains details of the new deal
      const { carId, deal_info } = req.body;
  
      // Check if the carId exists in the Cars collection
      const car = await Cars.findById(carId);
  
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
  
      // Create a new deal instance
      const newDeal = new Deal({
        car_id: carId,
        deal_info,
      });
  
      // Save the new deal to the Deal collection
      await newDeal.save();
  
      // Update the dealership to include the new deal in their list
      await dealership.updateOne({ $push: { deals: newDeal._id } });
  
      res.json({ success: true, message: 'Deal added to the dealership successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
router.get('/dealerships/:dealershipId/soldVehicles', async (req, res) => {
    try {
      const dealershipId = req.params.dealershipId;
  
      // Find the dealership by ID
      const dealership = await Dealership.findById(dealershipId);
  
      if (!dealership) {
        return res.status(404).json({ error: 'Dealership not found' });
      }
  
      // Populate the 'sold_vehicles' field to get details of all sold vehicles
      await dealership.populate('sold_vehicles').execPopulate();
  
      const soldVehicles = dealership.sold_vehicles;
  
      // Create an array to store detailed information about each sold vehicle along with owner info
      const soldVehiclesWithOwnerInfo = [];
  
      for (const soldVehicle of soldVehicles) {
        // Find the car details
        const carDetails = await Cars.findById(soldVehicle.car_id);
  
        if (!carDetails) {
          console.warn(`Car details not found for vehicle with ID: ${soldVehicle._id}`);
          continue;
        }
  
        // Find the owner details from the User model
        const ownerDetails = await User.findOne({ 'vehicle_info.vehicle_id': soldVehicle._id });
  
        soldVehiclesWithOwnerInfo.push({
          vehicle_id: soldVehicle._id,
          car_details: carDetails,
          owner_info: ownerDetails ? ownerDetails : null,
          vehicle_info: soldVehicle.vehicle_info,
        });
      }
  
      res.json({ soldVehiclesWithOwnerInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  

module.exports = router;