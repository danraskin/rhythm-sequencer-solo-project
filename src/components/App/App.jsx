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

import StepSequencer from '../StepSequencer/StepSequencer';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';

//for hard-coding sample inputs.
import BD from "../../samples/BD.WAV";
import SD from "../../samples/TOTAL_808_SAMPLE 9_S08.WAV"


import './App.css';

function App() {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch({ type: 'FETCH_USER' });
  // }, [dispatch]);

  //need to pass in inputs. let's hard-code first.

  //1) samples.
  const kitLibrary = {
    BD,
    SD
  }

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route
            exact
            path="/about"
          >
            <AboutPage />
          </Route>

          {/* This is where I will play */}

          <Route
            exact
            path="/home"
          >
            <StepSequencer
              kitLibrary={kitLibrary}
            />
          </Route>

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
