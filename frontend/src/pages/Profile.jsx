import React, { useEffect } from 'react';
import { useContext } from 'react';
import { store } from '../store';
import Salonprofile from './salon/Salonprofile';
import Userprofile from './user/Userprofile';

const Home = () => {
  const { state, dispatch } = useContext(store);
  const { user } = state;

  useEffect(() => {
    if (!user) window.location.href('/login');
  }, [user]);

  return (user && user.isAdmin) ? <Salonprofile /> : <Userprofile />;
};

export default Home;
