const mongoose = require('mongoose');

const Bookingmodel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerMobile: {
      type: String,
      required: true,
    },
    salonName:{
      type:String,
      required:true,
    },
    requestedTime: { type: String },
    suggestedTime: { type: String, default: '' },
    acceptedTime: { type: String, default: '' },
    stateOfProcess: { type: Number, default: 0 },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', Bookingmodel);
