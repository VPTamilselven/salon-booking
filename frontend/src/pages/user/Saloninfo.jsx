import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Servicessvg from '../../assets/services.svg';
import Logo from '../../assets/logo-black.png';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { toast } from 'react-toastify';
import moment from 'moment';
import { getError } from '../../util';
import axios from 'axios';
import { useReducer } from 'react';
import { useContext } from 'react';
import { store } from '../../store';
import { API_URL } from '../../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_COMPLETED':
      return { ...state, loading: false };
  }
};

function formatTime(timeString) {
  const [hourString, minute] = timeString.split(':');
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
}

const Saloninfo = () => {
  const params = useParams();
  const { salonid } = params;
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const { state, dispatch: ctxDispatch } = useContext(store);
  const { user } = state;

  const [salon, setSalon] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [openTime, setOpenTime] = useState('00:00');
  const [closeTime, setCloseTime] = useState('00:00');

  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' });
    const getSalonDetails = async () => {
      try {
        const { data } = await axios.get(
         API_URL +`api/salon/${salonid}`
        );
        setSalon(data);
        setOpenTime(formatTime(data.openingTime));
        setCloseTime(formatTime(data.closingTime));
      } catch (e) {
        toast.error(getError(e));
      }
      dispatch({ type: 'FETCH_COMPLETED' });
    };
    getSalonDetails();
  }, []);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = async (e) => {
    if (e.target.name === 'ok') {
      if (time === '' || date === '') {
        toast.error('Fill the required details');
        return;
      }
      try {
        const resonse = await axios.post(
          API_URL+'api/booking/user',
          {
            time: time + '=' + date,
            salonId: salonid,
            salonName: salon.name,
            customerName: user.name,
            customerMobile: user.mobile,
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        toast.success('Slot booked check history for details');
      } catch (e) {
        toast.error(getError(e));
      }

      setDialogOpen(false);
    } else {
      toast.error('Booking Canceled');
      setDialogOpen(false);
    }
  };

  const getMinDate = () => {
    if (salon.isOpenToday) {
      return moment(new Date()).format('YYYY-MM-DD');
    } else {
      return moment(new Date()).add(1, 'day').format('YYYY-MM-DD');
    }
  };
  return (
    <div className="saloninfo">
      {loading ? (
        <div className="progress"></div>
      ) : (
        salon && (
          <>
            <div className="saloninfo-header">
              <div className="book-now">
                <h1>{salon.name}</h1>
                <div className="saloninfo-btn-div">
                  <button
                    className="saloninfo-btn"
                    onClick={handleClickOpen}
                  >
                    <img src={Logo} />
                    {salon.isOpenToday ? 'BOOK NOW' : 'Today Closed'}
                  </button>
                </div>
              </div>
              <p>
                {salon.address} {salon.city} - {salon.pincode}
              </p>
            </div>
            <div className="services-provided">
              <h1>Services Provided</h1>
              <div className="services">
                {salon.services.map((ele, idx) => {
                  return (
                    <p className="service" key={idx}>
                      {' '}
                      <img
                        className="services-svg"
                        src={Servicessvg}
                        alt=""
                      />{' '}
                      {ele}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="saloninfo-photos">
              <div className="salon-photos">
                <h1>Gallery</h1>
                <div className="salon-images">
                  <div className="salon-image">
                    {' '}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzNPNPvBDTWb5ApP4yarQcQV9kKwaIWbmDhQ&usqp=CAU"
                      alt=""
                    />{' '}
                  </div>
                  <div className="salon-image">
                    {' '}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiZtklJokPr7yg5OkfdgolIAGHsWjmK0e17Q&usqp=CAU"
                      alt=""
                    />{' '}
                  </div>
                  <div className="salon-image">
                    {' '}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Kf0CrmdkDmChfqALAQM-TdjiLN76SuJkug&usqp=CAU"
                      alt=""
                    />{' '}
                  </div>
                  <div className="salon-image">
                    {' '}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAyh7JClABzgeo8nisHUeSjJbuLGel6cUk5A&usqp=CAU"
                      alt=""
                    />{' '}
                  </div>
                </div>
              </div>
              <div className="stylist-photo">
                <h1>Stylist</h1>
                <div className="stylist-images">
                  <div className="stylist-image">
                    {' '}
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzy7W-nyDgS5joDyB9l_OSmByMXwRDJG5Qw&usqp=CAU"
                      alt=""
                    />{' '}
                  </div>
                  <div className="stylist-image">
                    {' '}
                    <img
                      src="https://looksgud.com/blog/wp-content/uploads/2017/07/style-inspiration.jpg"
                      alt=""
                    />{' '}
                  </div>
                </div>
              </div>
            </div>
            {/* =============== POPUP FORM ========================== */}
            <div>
              <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogContent>
                  <DialogContentText className="dialog-text">
                    Please fill out the date and time to book your slot
                  </DialogContentText>
                  <DialogContentText className="dialog-text">
                    Shop timings {openTime} to {closeTime}
                  </DialogContentText>
                  <div className="dialog-inputs">
                    <input
                      type="date"
                      className="dialog-input"
                      min={getMinDate()}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />

                    <input
                      type="time"
                      className="dialog-input"
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="saloninfo-dialog-btn"
                    name="cancel"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="saloninfo-dialog-btn"
                    name="ok"
                    onClick={handleClose}
                  >
                    Book
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            
          </>
        )
      )}
    </div>
  );
};

export default Saloninfo;
