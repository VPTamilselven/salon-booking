const salonRouter = require('express').Router();
const Salon = require('../models/Salonmodel');
const bcrypt = require('bcryptjs');
const { generateSalonToken, isAuth } = require('../utils');

salonRouter.get('/', async (req, res) => {
  try {
    const salons = await Salon.find({});
    res.status(200).send(salons);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

salonRouter.post('/', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.salonstate;
    const pincode = req.body.pincode;
    const services = req.body.services;
    const hashPassword = bcrypt.hashSync(req.body.password);
    const salon = new Salon({
      name: name,
      email: email,
      mobile: mobile,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
      services: services,
      password: hashPassword,
      isAdmin:true
    });
    const newSalon = await salon.save();
    const { password, ...salonData } = newSalon._doc;
    res.status(200).send({ 
      _id: salonData._id,
      name: salonData.name,
      email: salonData.email,
      mobile: salonData.mobile,
      address: salonData.address,
      city: salonData.city,
      state: salonData.state,
      pincode: salonData.pincode,
      services: salonData.services,
      openingTime:salonData.openingTime,
      closingTime:salonData.closingTime,
      isOpenToday:salonData.isOpenToday,
      isAdmin:true,
      token: generateSalonToken(salonData) });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

salonRouter.get('/:salonid', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.salonid);
    res.status(200).send(salon);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

salonRouter.put('/:salonid', isAuth, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.salonid).select('+password');
    salon.name = req.body.name || salon.name;
    salon.email = req.body.email || salon.email;
    salon.mobile = req.body.mobile || salon.mobile;
    salon.address = req.body.address || salon.address;
    salon.city = req.body.city || salon.city;
    salon.state = req.body.salonstate || salon.state;
    salon.pincode = req.body.pincode || salon.pincode;
    salon.salonPhotos = req.body.salonPhotos || salon.salonPhotos;
    salon.stylistPhotos = req.body.stylistPhotos || salon.stylistPhotos;
    salon.openingTime = req.body.openTime;
    salon.closingTime = req.body.closeTime;
    salon.isOpenToday = req.body.isOpenToday;
    if (req.body.services) {
      salon.services = req.body.services;
    }
    if (req.body.password) {
      salon.password = bcrypt.hashSync(req.body.password);
    }
    const updatedSalon = await salon.save();
    const { password, ...salonData } = updatedSalon._doc;
    res.status(200).send({
      _id: salonData._id,
      name: salonData.name,
      email: salonData.email,
      mobile: salonData.mobile,
      address: salonData.address,
      city: salonData.city,
      state: salonData.state,
      pincode: salonData.pincode,
      openingTime: salonData.openingTime,
      closingTime: salonData.closingTime,
      services: salonData.services,
      isAdmin: salonData.isAdmin,
      isOpenToday: salonData.isOpenToday,
      token: generateSalonToken(salonData),
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = salonRouter;
