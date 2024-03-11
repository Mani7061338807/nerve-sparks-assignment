const mongoose = require('mongoose');
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
    name: String,
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
  const Dealership = mongoose.model('Dealership', dealershipSchema);
  module.exports=Dealership