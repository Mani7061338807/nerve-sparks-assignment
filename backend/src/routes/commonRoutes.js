const express = require('express');
const router = express.Router();
const Cars = require('../models/schema');

router.get('/cars',async(req,res)=>{
    try {
        // Find all cars in the Cars model
        const allCars = await Cars.find();
    
        res.status(200).json(allCars);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});
router.get('/cars/:dealershipId',async(req,res)=>{
    try {
        const dealershipId = req.params.dealershipId;
    
        // Find the dealership by ID
        const dealership = await Dealership.findById(dealershipId);
    
        if (!dealership) {
          return res.status(404).json({ error: 'Dealership not found' });
        }
    
        // Populate the 'cars' field to get details of all cars
        await dealership.populate('cars').execPopulate();
    
        const cars = dealership.cars;
    
        res.json({ cars });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});
router.post('/add-vehicle/:userType/:userId',async(req,res)=>{
    try {
        const dealId = req.params.dealId;
    
        // Find the deal by ID
        const deal = await Deal.findById(dealId);
    
        if (!deal) {
          return res.status(404).json({ error: 'Deal not found' });
        }
    
        // Assuming the 'car_id' in the deal contains the vehicle information
        const carId = deal.car_id;
    
        // Create a new entry in the 'SoldVehicles' collection
        const soldVehicle = new SoldVehicles({
          car_id: carId,
          // You can add additional information related to the sold vehicle here
        });
    
        await soldVehicle.save();
    
        // Update the user or dealership to include the new vehicle in their list
        // For example, if it's a dealership
        const dealership = await Dealership.findOneAndUpdate(
          { _id: deal.dealership_id },
          { $push: { sold_vehicles: soldVehicle._id } },
          { new: true }
        );
    
        // If it's a user, you can similarly update the user model
    
        res.json({ success: true, message: 'Deal completed successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});
router.get('/api/dealerships/:dealershipId/deals', async (req, res) => {
    try {
      const dealershipId = req.params.dealershipId;
  
      // Find the dealership by ID
      const dealership = await Dealership.findById(dealershipId);
  
      if (!dealership) {
        return res.status(404).json({ error: 'Dealership not found' });
      }
  
      // Populate the 'deals' field to get details of all deals
      await dealership.populate('deals').execPopulate();
  
      const deals = dealership.deals;
  
      res.json({ deals });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;