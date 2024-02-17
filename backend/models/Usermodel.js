const mongoose = require('mongoose');

const Usermodel = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    pincode: { type: Number, required: true },
    password: { type: String, required: true },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', Usermodel);
