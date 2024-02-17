import { createContext, useReducer } from 'react';

export const store = createContext();

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...state, user: action.payload };
    case 'SIGN_OUT':
      return { ...state, user: null };
    case 'ADD_IMAGE':
      const user=state.user;
      return { ...state, user: { ...user, image: action.payload } };
    default:
      return state;
  }
}

export function Provider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <store.Provider value={value}>{props.children}</store.Provider>;
}
