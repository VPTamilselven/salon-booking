const express = require('express');
const app = express();
require('dotenv').config();
const core = require('cors');
const userRouter = require('./routes/userRoutes.js');
const salonRouter = require('./routes/salonRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const loginRoute = require('./routes/loginRoute');
const mongoose = require('mongoose');
const path=require('path')

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`DB connected Server listning at Port ${process.env.PORT}!`)
    );
  })
  .catch((e) => console.log(e));

app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: '500mb' })
);
app.use(express.json());
app.use(core());

// app.use(express.static(path.join(__dirname,'/frontend/build')));
// app.get("*",(req,res) => {
//   res.sendFile(path.join(__dirname,'/frontend/build/index.html'));
// })

app.use('/api/login', loginRoute);
app.use('/api/user', userRouter);
app.use('/api/salon', salonRouter);
app.use('/api/booking', bookingRouter);