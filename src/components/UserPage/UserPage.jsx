import React, { useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function UserPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const patterns = useSelector(store => store.patterns) 

  useEffect(()=>{
    dispatch({type: 'FETCH_USER_PATTERNS'});
  },[]);

  return (
    <div className="dropdown">
      {patterns.map(pattern => (
        <div key={pattern.id}>
          <button className="btn" onClick={()=>history.push(`/pattern/${pattern.id}`)}>{pattern.name}</button>
        </div>
      ))}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
