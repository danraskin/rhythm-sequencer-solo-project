import React, { useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector,useDispatch } from 'react-redux';

function UserPage() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);
  // const patterns = useSelector(store => store.patterns) 

  useEffect(()=>{
    dispatch({type: 'FETCH_USER_PATTERNS'});
  },[]);

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
