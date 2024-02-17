const mongoose = require('mongoose');

const Salonschema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    services: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    salonPhotos: {
      type: [
        {
          type: String,
        },
      ],
    },
    stylistPhotos: {
      type: [
        {
          type: String,
        },
      ],
    },
    openingTime: { type: String, default: '00:00' },
    closingTime: { type: String, default: '00:00' },
    isOpenToday: { type: Boolean, default: true },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Salon', Salonschema);
