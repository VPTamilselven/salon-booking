import React, { useEffect } from 'react';
import { json, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { store } from '../../store';
import logo from '../../assets/logo.png';
import Auth from '../../assets/undraw_my_password_re_ydq7.svg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useReducer } from 'react';
import { getError } from '../../util';
import { API_URL } from '../../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SENDING_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};

const Signup = () => {
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });
  const { state, dispatch: ctxDispatch } = useContext(store);
  const { user } = state;

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast.error('Enter a valid Mobile number');
    } else if (pincode.length !== 6) {
      toast.error('Enter a valid PIN code');
    } else if (password !== cpassword) {
      toast.error("Passwords doesn't match");
    } else {
      try {
        dispatch({ type: 'SENDING_REQUEST' });
        const response = await axios.post(
          API_URL+'api/user/signup',
          {
            name,
            mobile,
            city,
            pincode,
            password,
          }
        );
        // console.log(response);
        const { data } = response;
        ctxDispatch({ type: 'SIGN_IN', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: 'REQUEST_COMPLETED' });
        window.location.href = '/';
      } catch (e) {
        toast.error(getError(e));
      }
    }
  };

  useEffect(() => {
    if (user) window.location.href = '/';
  }, [user]);
  return (
    <div className="signup">
      {loading ? (
        <div className="progress"></div>
      ) : (
        <>
          <div className="signup-form-container">
            <div className="signup-header">
              <h1>SIGN UP</h1>
              <p>
                Already a user?{' '}
                <Link to="/login" className="signup-to-login-link">
                  Login here
                </Link>{' '}
              </p>
            </div>
            <div className="signup-form-div">
              <div className="signup-form-labels">
                <p className="signup-form-label">NAME</p>
                <p className="signup-form-label">MOBILE</p>
                <p className="signup-form-label">CITY</p>
                <p className="signup-form-label">PIN CODE</p>
                <p className="signup-form-label">PASSWORD</p>
                <p className="signup-form-label">CONFIRM-PASSWORD</p>
                {/* <p className="signup-form-label">OTP <button className='otp-btn'>Send OTP</button></p> */}
              </div>
              <div className="signup-form-inputs">
                <form
                  id="signup-form"
                  className="signup-form"
                  onSubmit={submitHandler}
                >
                  <input
                    className="signup-input"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    className="signup-input"
                    type="tel"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                  <input
                    className="signup-input"
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    className="signup-input"
                    type="number"
                    name="pincoe"
                    placeholder="Enter your PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                  <input
                    className="signup-input"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    className="signup-input"
                    type="password"
                    name="cpassword"
                    placeholder="Retype the password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                    required
                  />
                  {/* <input
                className="signup-input"
                type="number"
                name="otp"
                placeholder="Enter the OTP"
                required
              /> */}
                </form>
              </div>
            </div>
            <div className="signup-btn-div flex-center">
              <button form="signup-form" type="submit" className="signup-btn">
                <i className="fa-solid fa-arrow-right "></i>Signup
              </button>
            </div>
          </div>
          <div className="signup-img-container">
            <img className="signup-logo" src={logo} alt="" />
            <img className="signup-svg" src={Auth} alt="" />
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;
