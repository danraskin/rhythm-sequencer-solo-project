import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import Junk from '../StepSequencer/Junk';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);
  // const [ armed, setArmed ] = useState(false);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
    dispatch({type: 'FETCH_SAMPLES'});

  }, [dispatch]);
  
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Redirect exact from="/" to="/pattern" />
          <Route
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

        <ProtectedRoute
          exact
          path="/user"
        >
          <UserPage />
        </ProtectedRoute>

          <Route
            exact
            path="/login"
          >
            {user.id ?
              <Redirect to="/" />
              :
              <LoginPage />
            }
          </Route>

          <Route
            exact
            path="/registration"
          >
            {user.id ?
              <Redirect to="/" />
              :
              <RegisterPage />
            }
          </Route>

          {/* This is where I will play */}

          <Route
            exact
            path="/pattern"
          >
            <Junk 
              // armed={armed}
              // setArmed={setArmed}
            />
          </Route>

          <ProtectedRoute
            exact
            path="/pattern/:id"
          >
            <Junk 
              // armed={armed}
              // setArmed={setArmed}
            />
          </ProtectedRoute>

          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;



// {/* <Router>
// <div>
//   <Nav />
//   <Switch>
//     {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
//     <Redirect exact from="/" to="/home" />

//     {/* Visiting localhost:3000/about will show the about page. */}
//     <Route
//       // shows AboutPage at all times (logged in or not)
//       exact
//       path="/about"
//     >
//       <AboutPage />
//     </Route>

//     {/* For protected routes, the view could show one of several things on the same route.
//       Visiting localhost:3000/user will show the UserPage if the user is logged in.
//       If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
//       Even though it seems like they are different pages, the user is always on localhost:3000/user */}
//     <ProtectedRoute
//       // logged in shows UserPage else shows LoginPage
//       exact
//       path="/user"
//     >
//       <UserPage />
//     </ProtectedRoute>

//     <ProtectedRoute
//       // logged in shows InfoPage else shows LoginPage
//       exact
//       path="/info"
//     >
//       <InfoPage />
//     </ProtectedRoute>

//     <Route
//       exact
//       path="/login"
//     >
//       {user.id ?
//         // If the user is already logged in, 
//         // redirect to the /user page
//         <Redirect to="/user" />
//         :
//         // Otherwise, show the login page
//         <LoginPage />
//       }
//     </Route>

//     <Route
//       exact
//       path="/registration"
//     >
//       {user.id ?
//         // If the user is already logged in, 
//         // redirect them to the /user page
//         <Redirect to="/user" />
//         :
//         // Otherwise, show the registration page
//         <RegisterPage />
//       }
//     </Route>

//     <Route
//       exact
//       path="/home"
//     >
//       {user.id ?
//         // If the user is already logged in, 
//         // redirect them to the /user page
//         <Redirect to="/user" />
//         :
//         // Otherwise, show the Landing page
//         <LandingPage />
//       }
//     </Route>

//     {/* If none of the other routes matched, we will show a 404. */}
//     <Route>
//       <h1>404</h1>
//     </Route>
//   </Switch>
//   <Footer />
// </div>
// </Router> */}