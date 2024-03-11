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
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;