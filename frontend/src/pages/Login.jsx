import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { store } from '../store';
import Auth from '../assets/undraw_secure_login_pdn4.svg';
import logo from '../assets/logo.png';
import { useReducer } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../util';
import { API_URL } from '../Api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SENDING_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};
const Login = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(store);
  const { user } = state;

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SENDING_REQUEST' });
    try {
      const response = await axios.post(API_URL+'api/login/signin', {
        mobile,
        password,
      });
      console.log(response);
      const { data } = response;
      localStorage.setItem('user', JSON.stringify(data));
      ctxDispatch({ type: 'SIGN_IN', payload: data });
      dispatch({ type: 'REQUEST_COMPLETED' });
    } catch (e) {
      toast.error(getError(e));
    }
    dispatch({ type: 'REQUEST_COMPLETED' });
  };

  useEffect(() => {
    if (user) window.location.href = '/';
  }, [user]);

  return (
    <div className="login">
      <div className="form-container">
        <div className="login-outer">
          <div className="login-inner">
            <h1>LOGIN</h1>
            <p className="login-para">SignIn to your Account</p>
            <form onSubmit={submitHandler} className="login-form">
              <label className="login-label">
                Your Mobile
                <input
                  className="login-input"
                  type="tel"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </label>
              <label className="login-label">
                {' '}
                Password
                <input
                  className="login-input"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <div className="btn-div">
                <button type="submit" className="login-btn">
                  <i className="fa-solid fa-arrow-right "></i>Login
                </button>
              </div>
            </form>
            <p>
              Forget password?{' '}
              <a className="login-fp" href="">
                click here
              </a>
            </p>
            <div className="login-ca">
              {' '}
              <Link to="/signup"> Create an Account</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="img-container">
        <img className="login-logo" src={logo} alt="" />
        <img className="login-svg" src={Auth} alt="logo" />
      </div>
    </div>
  );
};

export default Login;
