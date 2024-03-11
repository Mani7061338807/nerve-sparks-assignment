// Schema for available car deals
const mongoose = require('mongoose');
const dealSchema = new mongoose.Schema({
  deal_id: {
    type: String,
    default: () => Math.random().toString(36).substring(7),
  },
  car_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',
  },
  deal_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Schema for info on cars
const carsSchema = new mongoose.Schema({
  car_id: {
    type: String,
    default: () => Math.random().toString(36).substring(7),
  },
  type: String,
  name: String,
  model: String,
  car_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Schema for cars sold
const soldVehiclesSchema = new mongoose.Schema({
  vehicle_id: {
    type: String,
    default: () => Math.random().toString(36).substring(7),
  },
  car_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',
  },
  vehicle_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Create models based on the schemas

const Deal = mongoose.model('Deal', dealSchema);
const Cars = mongoose.model('Cars', carsSchema);
const SoldVehicles = mongoose.model('SoldVehicles', soldVehiclesSchema);

module.exports = {
  Deal,
  Cars,
  SoldVehicles,
};
