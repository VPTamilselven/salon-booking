const Booking = require('../models/Bookingmodel');
const { isAuth } = require('../utils');

const bookingRouter = require('express').Router();

bookingRouter.post('/user', isAuth, async (req, res) => {
  try {
    const time = req.body.time;
    const userId = req.user._id;
    const customerName = req.body.customerName;
    const customerMobile = req.body.customerMobile;
    const salonName = req.body.salonName;
    const salonId = req.body.salonId;
    const newBooking = new Booking({
      userId: userId,
      salonId: salonId,
      requestedTime: time,
      salonName: salonName,
      customerName: customerName,
      customerMobile: customerMobile,
    });
    const booking = await newBooking.save();
    res.status(200).send({ booking: booking, message: 'Booking Suceess' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

bookingRouter.get('/user', isAuth, async (req, res) => {
  try {
    const userBookings = await Booking.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).send(userBookings);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

bookingRouter.post('/salon', isAuth, async (req, res) => {
  try {
    const process = req.body.stateOfProcess;
    const bookingId = req.body.bookingId;
    const suggestion = req.body.suggestion;
    const booking = await Booking.findById(bookingId);
    if (process === 2) {
      const msg = req.body.message;
      if (msg === 'time') {
        const time = req.body.time;
        booking.suggestedTime = time;
        booking.message='Suggested Time'
        booking.stateOfProcess = 3;
      } else {
        booking.message = msg || booking.message;
        booking.stateOfProcess = 2;
      }
    } else {
      booking.stateOfProcess = 1;
      booking.acceptedTime = suggestion
        ? booking.suggestedTime
        : booking.requestedTime;
    }
    const updatedBooking = await booking.save();
    res.status(200).send(updatedBooking);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

bookingRouter.get('/salon', isAuth, async (req, res) => {
  try {
    const userBookings = await Booking.find({ salonId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).send(userBookings);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = bookingRouter;
