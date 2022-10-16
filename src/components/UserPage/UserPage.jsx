import React, { useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function UserPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);
  const patterns = useSelector(store => store.patterns) 

  useEffect(()=>{
    dispatch({type: 'FETCH_USER_PATTERNS'});
  },[]);

  return (
    <div className="container">
      <h2>User: {user.username}</h2>
      {patterns.map(pattern => (
        <div key={pattern.id}>
          <button onClick={()=>history.push(`/pattern/${pattern.id}`)}>{pattern.name}</button>
        </div>
      ))}
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
