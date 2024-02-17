import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useContext } from 'react';
import Salonhistorycard from '../../componnents/Salonhistorycard';
import Salonwaitingcard from '../../componnents/Salonwaitingcard';
import { getError } from '../../util';
import { store } from '../../store';
import { useState } from 'react';
import { API_URL } from '../../Api';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_COMPLETED':
      return { ...state, loading: false };
  }
};

const Salonhome = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDipatch } = useContext(store);
  const { user } = state;
  const [history, setHistory] = useState([]);
  const [waiting, setWaiting] = useState([]);
  const [fetch,setFetch]=useState(false);

  useEffect(() => {
    const getDetails = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(API_URL+'api/booking/salon', {
          headers: { authorization: `Bearer ${user.token}` },
        });
        const historyList = data.filter(
          (e) =>
            e.stateOfProcess.toString() === '1' ||
            e.stateOfProcess.toString() === '2' ||
            e.stateOfProcess.toString() === '3'
        );
        const waitingList = data.filter(
          (e) => e.stateOfProcess.toString() === '0'
        );
        setHistory(historyList);
        setWaiting(waitingList);
      } catch (e) {
        getError(e);
      }
      dispatch({ type: 'REQUEST_COMPLETED' });
    };
    getDetails();
  }, [fetch]);
  return (
    <div className="salonhome">
      {loading ? (
        <div className="progress"></div>
      ) : (
        <>
          <div className="salonhome-left">
            <h1>Waiting Request</h1>
            <div className="salonwaiting-cards">
              {waiting.length === 0 ? (
                <h3>Empty</h3>
              ) : (
                waiting.map((e, idx) => {
                  return <Salonwaitingcard key={idx} data={e} user={user} callback={setFetch} fetch={fetch} />;
                })
              )}
            </div>
          </div>
          <div className="salonhome-right">
            <h1>History</h1>
            <div className="salonhistory-cards">
              {history.length === 0 ? (
                <h3>Empty</h3>
              ) : (
                history.map((e, idx) => {
                  return <Salonhistorycard key={idx} data={e} />;
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Salonhome;
