import axios from 'axios';
import React, { useEffect, useParams, useState } from 'react';
import { useReducer } from 'react';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Logo from '../../assets/logo-black.png';
import Userhistorycard from '../../componnents/Userhistorycard';
import { store } from '../../store';
import { getError } from '../../util';
import { API_URL } from '../../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};

const Userprofile = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(store);
  const { user } = state;
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [history, setHistory] = useState([]);
  const [fetch, setFetch] = useState(true);
  const [base64String, setBase64String] = useState(user.image);

  useEffect(() => {
    const getDetails = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(API_URL+'api/booking/user', {
          headers: { authorization: `Bearer ${user.token}` },
        });
        setHistory(data);
        setName(user.name);
        setMobile(user.mobile);
        setCity(user.city);
        setPincode(user.pincode);
      } catch (e) {
        toast.error(getError(e));
      }
      dispatch({ type: 'REQUEST_COMPLETED' });
    };
    getDetails();
  }, [fetch]);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      name !== user.name ||
      mobile !== user.mobile ||
      city !== user.city ||
      pincode !== user.pincode
    ) {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.put(
          API_URL+`api/user/updateuser/${user._id}`,
          {
            name,
            mobile,
            city,
            pincode,
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        ctxDispatch({ type: 'SIGN_IN', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
      } catch (e) {
        toast.error(getError(e));
      }
      dispatch({ type: 'REQUEST_COMPLETED' });
    }
  };

  const imghandler = () => {
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    reader.onload = function () {
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');
      setBase64String(base64String);
      ctxDispatch({ type: 'ADD_IMAGE', payload: base64String });
      const updatedUser = user;
      user.image = base64String;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="userprofile">
      {loading ? (
        <div className="progress"></div>
      ) : (
        history && (
          <>
            <div className="userprofile-left">
              <div className="profile-img">
                <img
                  src={
                    base64String
                      ? `data:image/jpg;base64,${base64String}`
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYduP9erFkId0aNuDIMKrBik4-nBSh0NSy5Q&usqp=CAU'
                  }
                  alt=""
                />
                <div className="profile-img-blur">
                  <input
                    type="file"
                    className="profile-img-blur-input"
                    accept="image/png, image/jpeg"
                    onChange={imghandler}
                  />
                  <p>Edit </p>
                  <i className="fa-solid fa-pen"></i>
                </div>
              </div>
              <div className="userprofile-user-details">
                <div className="userprofile-inputs-left">
                  <h3>NAME</h3>
                  <h3>Mobile</h3>
                  <h3>CITY</h3>
                  <h3>PINCODE</h3>
                </div>
                <div className="userprofile-inputs-right">
                  <input
                    className="userprofile-text-input"
                    value={name}
                    onInput={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <input
                    className="userprofile-text-input"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                  <input
                    className="userprofile-text-input"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                  <input
                    className="userprofile-text-input"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                  />
                </div>
              </div>
              <button onClick={submitHandler} className="userdetails-save-btn">
                {' '}
                <img src={Logo} /> SAVE
              </button>
            </div>
            <div className="userprofile-right">
              <h1>History</h1>
              <div className="userhistory-cards">
                {history.map((data, idx) => {
                  return (
                    <Userhistorycard
                      key={idx}
                      bookingDetails={data}
                      user={user}
                      callback={setFetch}
                      fetch={fetch}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Userprofile;
