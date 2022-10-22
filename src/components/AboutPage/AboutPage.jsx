import React from 'react';

function AboutPage() {
  return (
    <div className="container abt">
      <div className="abt_tech">
        <h3>Technologies used</h3>
        <hr/>
        <ul>
         <li>toneJS<img className="icon" src="https://avatars.githubusercontent.com/u/11019186?s=200&v=4"></img></li>
         <li>javscript<img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"></img></li>
         <li>html/css<img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/1/10/CSS3_and_HTML5_logos_and_wordmarks.svg"></img></li>
         <li>react<img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"></img></li>
         <li>redux-saga<img className="icon" src="https://redux-saga.js.org//img/Redux-Saga-Logo-Portrait.png"></img></li>
         <li>nodeJS<img className="icon" src="https://nodejs.org/static/images/logo-hexagon-card.png"></img></li>
         <li>express<img className="icon" src="https://expressjs.com/images/express-facebook-share.png"></img></li>
         <li>axios<img className="icon" src="https://user-images.githubusercontent.com/8939680/57233882-20344080-6fe5-11e9-9086-d20a955bed59.png"></img></li>
         <li>postgreSQL<img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg"></img></li>
        </ul>
      <div className="abt_next">
        <h3>Next steps</h3>
        <hr/>
        <ul>
          <li>Introduce sample parameter controls (volume, pitch)</li>
          <li>Integrate a generative synth player (Cracked web audio library!!)</li>
          <li>Allow creation of multi-bar patterns</li>
          <li>Support sample uploads and customizable kit libraries</li>
        </ul>
      </div>
      <div className="abt_thanks">
          <h3>Thanks</h3>
          <hr/>
          <p>Gratitude to my collaborators in <b>Prime Academy L'Engle cohort</b>, our instructor <b>Matt Black</b>, <b>Jaxon Vesely</b> who supplied me with a *MASSIVE* sample kit years ago, and developer <b>Garret Bodley</b>, whose <a href="https://medium.com/geekculture/creating-a-step-sequencer-with-tone-js-32ea3002aaf5">step sequencer tutorial</a> architecture I used as the backbone for my own</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
