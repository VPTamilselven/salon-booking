import React from 'react';
import { Link } from 'react-router-dom';

const Saloncard = ({ salon }) => {
  return (
    <>
      <div className="salon-card">
        <Link to={'/saloninfo/' + salon._id}>
          <div className="salon-card-img">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzy7W-nyDgS5joDyB9l_OSmByMXwRDJG5Qw&usqp=CAU"
              alt=""
            />
          </div>
          <div className="salon-card-details">
            <h1>{salon.name}</h1>
            <p>{salon.address}</p>
            <p>
              {salon.city} - {salon.pincode}
            </p>
          </div>
        </Link>
        <a href={'tel:+' + salon.mobile} className="call-link">
          <i className="fa-solid fa-phone-volume"></i>
          <p>{salon.mobile}</p>
        </a>
      </div>
    </>
  );
};

export default Saloncard;
