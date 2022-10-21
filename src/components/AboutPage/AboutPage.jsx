import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <p>Technologies used</p>
        <ul>
         <li>toneJS<img src="https://avatars.githubusercontent.com/u/11019186?s=200&v=4"></img></li>
         <li>react</li>
         <li>redux-saga</li>
         <li>postgreSQL</li>
         
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
