import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

function formatTime(timeString) {
  const [hourString, minute] = timeString.split(':');
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
}

function formatDate(dateString) {
  const [year, month, date] = dateString.split('-');
  return date + '/' + month + '/' + year;
}

const Salonhistorycard = ({ data }) => {
  const [acceptance, setAcceptance] = useState(true);
  const [requestedTime, setRequestedTime] = useState('');
  const [acceptedTime, setAcceptedTime] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [acceptedDate, setAcceptedDate] = useState('');

  useEffect(() => {
    setAcceptance(data.stateOfProcess.toString() === '1');
    const request = data.requestedTime.toString().split('=');
    setRequestedDate(formatDate(request[1]));
    setRequestedTime(formatTime(request[0]));
    const accept = data.acceptedTime.toString().split('=');
    if (accept.length !== 1) {
      setAcceptedDate(formatDate(accept[1]));
      setAcceptedTime(formatTime(accept[0]));
    }
  }, []);
  return (
    <div
      className="salonhistory-card"
      style={{ border: acceptance ? '1px solid white' : '1px solid red' }}
    >
      <div className="uhcard-header">
        <h3>{data.customerName} </h3>
        <a href="tel:+6379306614" className="historycard-call">
          <i className="fa-solid fa-phone"></i>
          {data.customerMobile}
        </a>
        {acceptance ? (
          <p>
            {' '}
            <i className="fa-solid fa-circle-check"></i> Accepted
          </p>
        ) : (
          <p>
            {' '}
            <i className="fa-solid fa-ban"></i>Declined
          </p>
        )}
      </div>
      <div className="uhcard-dates">
        <div className="uhcard-requested-dt">
          <h5>Requested Time</h5>
          <p>{requestedDate}</p>
          <p>{requestedTime}</p>
        </div>
        {!acceptance && (
          <div>
            <h5>Message</h5>
            <p>{data.message === '' ? 'Time Suggested' : data.message}</p>
          </div>
        )}
        <div className="uhcard-accepted-dt">
          <h5>Accepted Time</h5>
          <p>{acceptedDate === '' ? '- - - - -' : acceptedDate}</p>
          <p>{acceptedTime === '' ? '- - - - -' : acceptedTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Salonhistorycard;
