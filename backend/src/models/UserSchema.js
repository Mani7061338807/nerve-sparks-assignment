const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    name:String,
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
const User = mongoose.model('User', userSchema);
module.exports=User;