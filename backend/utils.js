const jwt = require('jsonwebtoken');
const e = require('express');

const isAuth = (req, res, next) => {
  
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
      if (err) res.status(401).send({ message: 'Invalid Token' });
      else {
        req.user = data;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'You are not Authenticated' });
  }
};

const generateUserToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      city: user.city,
      pincode: user.pincode,
      isAdmin: user.isAdmin,
    },
    process.env.SECRET_KEY,
    { expiresIn: '30d' }
  );
};

const generateSalonToken = (salon) => {
  return jwt.sign(
    {
      _id: salon._id,
      name: salon.name,
      email: salon.email,
      mobile: salon.mobile,
      address: salon.address,
      city: salon.city,
      state: salon.state,
      pincode: salon.pincode,
      services: salon.services,
      isAdmin: salon.isAdmin,
      openingTime: salon.openingTime,
      closingTime: salon.closingTime,
      isOpenToday: salon.isOpenToday,
    },
    process.env.SECRET_KEY,
    { expiresIn: '30d' }
  );
};

module.exports = { isAuth, generateUserToken, generateSalonToken };
