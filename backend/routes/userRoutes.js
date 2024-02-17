const User = require('../models/Usermodel');
const { isAuth, generateUserToken } = require('../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  try {
    const name = req.body.name;
    const mobile = req.body.mobile;
    const city = req.body.city;
    const pincode = req.body.pincode;
    const hashPassword = bcrypt.hashSync(req.body.password);
    const newUser = new User({
      name: name,
      mobile: mobile,
      city: city,
      pincode: pincode,
      password: hashPassword,
      // image:''
    });
    const user = await newUser.save();
    const {password,image,...userData}=user._doc;
    res.status(200).send({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      city: user.city,
      pincode: user.pincode,
      isAdmin: user.isAdmin,
      // image:image,
      token: generateUserToken(userData),
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

userRouter.get('/:userid', isAuth, async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid);
    const { password, ...foundUser } = user._doc;
    res.status(200).send(foundUser);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

userRouter.put('/updateuser/:userid', isAuth, async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid);
    if (user) {
      user.name = req.body.name || user.name;
      user.mobile = req.body.mobile || user.mobile;
      user.city = req.body.city || user.city;
      user.pincode = req.body.pincode || user.pincode;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password);
      }
    }
    const updatedUser = await user.save();
    res.status(200).send({
      _id: updatedUser._id,
      name: updatedUser.name,
      mobile: updatedUser.mobile,
      city: updatedUser.city,
      pincode: updatedUser.pincode,
      isAdmin: updatedUser.isAdmin,
      token: generateUserToken(updatedUser),
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = userRouter;
