import React from 'react';
import { useEffect } from 'react';
import Saloncard from '../../componnents/Saloncard';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../../util';
import { useReducer } from 'react';
import { API_URL } from '../../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};

const Userhome = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch({ type: 'FETCH_REQUEST' });
    const getSalons = async () => {
      try {
        const { data } = await axios.get(API_URL+'api/salon/');
        setSalons(data);
      } catch (e) {
        toast.error(getError(e));
      }
      dispatch({ type: 'REQUEST_COMPLETED' });
    };
    getSalons();
  }, []);

  useEffect(() => {
    return () => {
      dispatch({ type: 'FETCH_REQUEST' });
      if (search !== '') {
        const elements = document.getElementsByClassName('salon-card');
        if (salons) {
          for (var i = 0; i < elements.length; i++) {
            if (
              !elements[i].innerHTML
                .toLowerCase()
                .includes(search.toLowerCase())
            ) {
              elements[i].style.display = 'none';
            } else {
              elements[i].style.display = 'block';
            }
          }
        }
      }
      dispatch({ type: 'REQUEST_COMPLETED' });
    };
  }, [search]);

  return (
    <div className="userhome">
      <div className="userhome-header">
        <h1 className="userhome-heading">Featured Salons</h1>

        <div className="userhome-input-div">
          <i className="fa-solid fa-magnifying-glass-location search-icon"></i>
          <input
            className="userhome-input"
            type="text"
            placeholder="Search by Salon name or place"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="salon-cards">
        {loading ? (
          <div className="progress"></div>
        ) : (
          salons.map((salon, idx) => {
            return <Saloncard key={idx} salon={salon} />;
          })
        )}
      </div>
    </div>
  );
};

export default Userhome;
