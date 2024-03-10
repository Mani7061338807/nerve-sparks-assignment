const mongoose = require('mongoose');

// Schema for admin
const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Schema for car buyer
const userSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    default: () => Math.random().toString(36).substring(7),
  },
  user_location: String,
  user_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  password: String,
  vehicle_info: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',
  }],
});

// Schema for car seller
const dealershipSchema = new mongoose.Schema({
  dealership_email: {
    type: String,
    required: true,
    unique: true,
  },
  dealership_id: {
    type: String,
    default: () => Math.random().toString(36).substring(7),
  },
  dealership_name: String,
  dealership_location: String,
  password: String,
  dealership_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  cars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',
  }],
  deals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deal',
  }],
  sold_vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sold_vehicles',
  }],
});

// Schema for available car deals
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
const Admin = mongoose.model('Admin', adminSchema);
const User = mongoose.model('User', userSchema);
const Dealership = mongoose.model('Dealership', dealershipSchema);
const Deal = mongoose.model('Deal', dealSchema);
const Cars = mongoose.model('Cars', carsSchema);
const SoldVehicles = mongoose.model('SoldVehicles', soldVehiclesSchema);

module.exports = {
  Admin,
  User,
  Dealership,
  Deal,
  Cars,
  SoldVehicles,
};
