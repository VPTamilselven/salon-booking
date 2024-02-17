import React,{ useEffect } from 'react';
import { useContext } from 'react';
import { store } from '../store';
import Salonhome from './salon/Salonhome';
import Userhome from './user/Userhome';

const Home = () => {
  const { state, dispatch } = useContext(store);
  const { user } = state;

  useEffect(() => {
    if (!user) window.location.href='/login';
  }, [user]);
  return (user && user.isAdmin) ? <Salonhome /> : <Userhome />;
};

export default Home;
