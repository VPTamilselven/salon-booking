import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
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

const Userhistorycard = ({ bookingDetails, user, callback, fetch }) => {
  const [requestedTime, setRequestedTime] = useState('');
  const [acceptedTime, setAcceptedTime] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [acceptedDate, setAcceptedDate] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [stateOfProcess, setStateOfProcess] = useState('');

  useEffect(() => {
    const fillDetails = () => {
      const request = bookingDetails.requestedTime.toString().split('=');
      setRequestedDate(formatDate(request[1]));
      setRequestedTime(formatTime(request[0]));
      const accept = bookingDetails.acceptedTime.toString().split('=');
      if (accept.length !== 1) {
        setAcceptedDate(formatDate(accept[1]));
        setAcceptedTime(formatTime(accept[0]));
      }
      const suggest = bookingDetails.suggestedTime.toString().split('=');
      if (suggest.length !== 1) {
        setSuggestedDate(formatDate(suggest[1]));
        setSuggestedTime(formatTime(suggest[0]));
      }
      setStateOfProcess(bookingDetails.stateOfProcess.toString());
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
            bookingId: bookingDetails._id,
            suggestion: true,
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
            bookingId: bookingDetails._id,
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
    <div className="uhcard">
      <div className="uhcard-header">
        <h3>{bookingDetails.salonName}</h3>
        <p>
          State of process :{' '}
          {stateOfProcess === '0'
            ? 'Waiting'
            : stateOfProcess === '1'
            ? 'Accepted'
            : stateOfProcess === '2'
            ? 'Rejected'
            : 'Suggested'}
        </p>
      </div>
      <div className="uhcard-dates">
        <div className="uhcard-requested-dt">
          <h5>Requested Time</h5>
          <p>{requestedDate}</p>
          <p>{requestedTime}</p>
        </div>
        <div className="uhcard-accepted-dt">
          <h5>Accepted Time</h5>
          <p>{acceptedDate === '' ? '- - - - -' : acceptedDate}</p>
          <p>{acceptedTime === '' ? '- - - - -' : acceptedTime}</p>
        </div>
      </div>
      {stateOfProcess === '3' ? (
        <>
          <div className="suggestion d-flex">
            <div className="uhcard-requested-dt">
              <h5>Suggested Time</h5>
              <p>{suggestedDate}</p>
              <p>{suggestedTime}</p>
            </div>
            <div className="uhbtn-div d-flex">
              <button
                className="uhcard-btn primary-btn"
                value="accept"
                onClick={submitHandler}
              >
                <i className="fa-solid fa-circle-check"></i> Accept
              </button>
              <button
                className="uhcard-btn secondary-btn"
                value="reject"
                onClick={submitHandler}
              >
                <i className="fa-solid fa-circle-xmark"></i> Reject
              </button>
            </div>
          </div>
        </>
      ) : stateOfProcess === '2' ? (
        <div className="d-flex" style={{ gap: '1rem', alignItems: 'center' }}>
          <h5>Reason : </h5>
          <p>{bookingDetails.message}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Userhistorycard;
