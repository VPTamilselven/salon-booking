import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../util';
import { API_URL } from '../Api';

function formatTime(timeString) {
  const [hourString, minute] = timeString.split(':');
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
}

function formatDate(dateString) {
  const [year, month, date] = dateString.split('-');
  return date + '/' + month + '/' + year;
}

const Salonwaitingcard = ({ data, user, callback,fetch }) => {
  const [rejectmsg, setRejectmsg] = useState('Suggest time');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');

  useEffect(() => {
    const fillDetails = () => {
      const request = data.requestedTime.toString().split('=');
      setRequestedDate(formatDate(request[1]));
      setRequestedTime(formatTime(request[0]));
    };
    fillDetails();
  }, []);

  const submitHandler = async (e) => {
    if (e.target.value === 'accept') {
      try {
        const response = await axios.post(
          API_URL+'api/booking/salon',
          {
            stateOfProcess: 1,
            bookingId: data._id,
          },
          { headers: { authorization: `Bearer ${user.token}` } }
        );
      } catch (e) {
        toast.error(getError(e));
      }
    } else {
      try {
        const response = await axios.post(
          API_URL+'api/booking/salon',
          {
            stateOfProcess: 2,
            bookingId: data._id,
            message: rejectmsg === 'Suggest time' ? 'time' : rejectmsg,
            time:
              suggestedTime + '=' + data.requestedTime.toString().split('=')[1],
          },
          { headers: { authorization: `Bearer ${user.token}` } }
        );
      } catch (e) {
        toast.error(getError(e));
      }
    }
    callback(!fetch);
  };

  return (
    <div className="salonwaitingcard">
      <div className="swcard-left">
        <div className="swcard-header">
          <h3>{data.customerName} </h3>
          <a href="tel:+6379306614" className="historycard-call">
            <i className="fa-solid fa-phone"></i>
            {data.customerMobile}
          </a>
        </div>
        <div className="swcard-content">
          <div className="swcard-req">
            <h5>Requested Time</h5>
            <p>{requestedDate}</p>
            <p>{requestedTime}</p>
          </div>
          <div className="reject-msg">
            <label for="reason">Choose a option to reject </label>
            <select
              name="reason"
              id="reason"
              onChange={(e) => setRejectmsg(e.target.value)}
            >
              <option value="Salon Closed">Salon Closed</option>
              <option value="Request earlier">Request earlier</option>
              <option value="Request later">Request later</option>
              <option value="Suggest time" selected>
                Suggest time
              </option>
            </select>
            {rejectmsg === 'Suggest time' && (
              <input
                className="swcard-input"
                type="time"
                name="suggestedDate"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="swcard-right">
        <button
          className="swcard-btn primary-btn"
          value="accept"
          onClick={submitHandler}
        >
          <i className="fa-solid fa-circle-check"></i> Accept
        </button>
        <button
          className="swcard-btn secondary-btn"
          value="reject"
          onClick={submitHandler}
        >
          <i className="fa-solid fa-circle-xmark"></i> Reject
        </button>
      </div>
    </div>
  );
};

export default Salonwaitingcard;
