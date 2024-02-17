const loginRouter = require('express').Router();
const User = require('../models/Usermodel');
const Salon = require('../models/Salonmodel');
const bcrypt = require('bcryptjs');
const { generateSalonToken, generateUserToken } = require('../utils');

loginRouter.post('/signin', async (req, res) => {
  try {
    const mobile = req.body.mobile;
    const bodyPassword = req.body.password;
    const user = await User.findOne({ mobile: mobile });
    const salon = await Salon.findOne({ mobile: mobile }).select('+password');
    if (user) {
      if (bcrypt.compareSync(bodyPassword, user.password)) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          mobile: user.mobile,
          city: user.city,
          pincode: user.pincode,
          isAdmin: user.isAdmin,
          token: generateUserToken(user),
        });
      } else {
        res.status(401).send({ message: 'Incorrect Password' });
      }
    } else if (salon) {
      if (bcrypt.compareSync(bodyPassword, salon.password)) {
        const { password, ...salonData } = salon._doc;
        res.status(200).send({
          _id: salonData._id,
          name: salonData.name,
          mobile: salonData.mobile,
          address: salonData.address,
          city: salonData.city,
          state: salonData.state,
          pincode: salonData.pincode,
          email: salonData.email,
          openingTime: salonData.openingTime,
          closingTime: salonData.closingTime,
          isOpenToday: salonData.isOpenToday,
          services: salonData.services,
          salonPhotos: salonData.salonPhotos,
          stylistPhotos: salonData.stylistPhotos,
          isAdmin: salonData.isAdmin,
          token: generateSalonToken(salonData),
        });
      } else {
        res.status(401).send({ message: 'Invalid Password' });
      }
    } else {
      res.status(401).send({ message: 'User not found' });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = loginRouter;
