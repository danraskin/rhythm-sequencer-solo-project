
# React/ToneJS Drum Machine

A full-stack, sample-based step sequencer built using React and ToneJS. I built this in a 2-week spring as a solo project for Prime Digital Academy, an accelerated full-stack software engineering program. The sequencer integrates ToneJS into the react-redux-saga/node-postgreSQL stack taught in the Prime curriculum. 

- Uses Tone.js web audio library to trigger samples.
- Registered users can save, access and edit stored beat sequences.
- Users can select from 4 sound libraries, two of which are custom percussion libararies recorded by me. They sound particularly nasty.
- Users can select sequence length.
- Users can set a "double-trigger" setting on each step for more complex patterns.

<img src="https://user-images.githubusercontent.com/104224468/198123553-c204f338-b642-4a2e-8108-3dd93dbfae9a.png" width=400 />

## Using the Sequencer

Check it out [here](https://rhythm-sequencer-solo-project.herokuapp.com)!

Any user can access the full functionality of the sequencer. To save a pattern, they must login or register an account. Once logged in, users can save, access, edit or delete patterns. Database stores sequence length, step status, pattern name, and most recently selected drumKit. BPM is automatically reset to 120 when navigating to either a new or saved pattern from any page.

  * SHIFT + CLICK to set step status to 'double trigger'
  * things might get freaky when users navigate to a new or saved pattern without *stopping* the clock/sequencer. if this happens, stop -> start or refresh.

## Deployment

If deploying locally:

  clone repo
  ```bash
  ~$ git clone git@github.com:danraskin/~$ rhythm-sequencer-solo-project.git
  ~$ npm install
  ```

  make postgres database
  ```bash
 ~$ psql createdb rhythm_sequencer
 ~$ psql rhythm_sequencer < database.sql
  ```
  start application
  ```bash
  ~$ npm run server
  ```
  Server runs on port: 5000
  ```bash    
  ~$ npm run client
  ```
  Client runs on port: 3000

## The 🦑 🦗 GUTS 🦐 🐙 

   I hope that a detailed written description of this code can help orient anybody searching for tips on how to build a step-sequencer using React and ToneJS.

  `grid` is primary data object used to create patterns
  `drumKit` is an array of playable audio sample
  `pattern` refers to the current grid and drumKit objects

### ARCHITECTURE

  The main app components live in /src/StepSequencer. There are two primary components: `Junk` and `Guts`. Data objects are `grid` array and `drumKit` array (see below)

  `Junk`
  * creates `grid` array and `drumKit` array.
  * requests saved pattern data from server (axios)
  * passes props to `Guts` component.
  * registers changes to BPM slider, pattern name, and steps in sequence.

  `Guts`
  * renders `grid` to DOM.
  * user clicks to DOM grid set step status 
  * sets clock and tracks steps in sequence
  * triggers `drumKit` sample playback
  * saves pattern data to saga functions.

### DATA STRUCTURES

  `grid` array models a pattern.

  rows correspond to sample players in `drumKit`. 

  columns correspond to steps in sequence.
```
  [ 
    [ {...}, {...}, {...}, {...} ],
    [ {...}, {...}, {...}, {...} ],
    [ {...}, {...}, {...}, {...} ]
  ]
```

  'step' object is:
  
```
  {
    isActive: [0],
    step: [i]
  }
```

  `drumKit` array is an array of ToneJS players.
```
  [
    Tone.Player(BD),
    Tone.Player(SD),
    Tone.Player(HH)
  ]
```
  Players are created using paths to sample .WAVs. 

  `grid` and `drumKit` are created in `Junk` on DOM load and passed to `Guts` as props.
  
  New `grid` defaults to 8-step sequence and new `drumKit` defaults to TR808-1 sample kit.

### REACT HOOKS

  Originally, I attempted to route all axios requests through Redux-Sagas and to store all data used by components in Redux reducers. This created problems related to component rendering, so I refactored the app to rely on mostly on React useState hook. Most pieces of state are set and accessed in `Junk` and passed to `Guts`.

  `armed` and `playing` are boolean values used to gate toggleSequencePlayback() in `Guts`.

### REDUX/SAGAS

  User, sample, and saved pattern data are retrieved from database by Axios requests in saga functions; Saved pattern data is retrieved by Axios request in `Junk`

  useEffect in `App` component dispatches GET requests for current user data and sample data via Saga functions.

### TONEJS

  Tone.Players are created by buildDrumKit() in `Junk` and saved to `drumKit`. I don't quite understand what distinguishes Buffers and Players, but together, they create a playable object that can trigger .WAV playbacks. It is possible that buffers do not actually need to be defined.

  Playback is controlled by ToggleSequencePlayback() in `Guts`.

  - `Tone.start()` is called the first time user clicks `play`. It can only be called *once* per Junk.jsx load, otherwise Tone playback breaks. Logic gated by state of `armed`. `armed` state is accessed in `Junk` and passed to `Guts`, so `Guts` re-renders do not reset `armed` to FALSE. 
  - `Tone.Transport.start()`, `Tone.Transport.stop()` start and stop the Tone clock. BPM is inherited via `Junk`, and can be modified while clock is running.
  - `Tone.Transport.scheduleRepeat(triggerSample(),"8n")` schedules a repeating event. triggerSample() is called every 8th note along while Tone clock is running. `scheduleRepeat()` returns a unique event ID (see ToneJS documentation).
  - `Tone.Transport.cancel(repeater)` cancels target event. Without cancelling, multiple `scheduleRepeat` events stack on top of each other, triggering multiple patterns to play at once. it gets ugly!

## Technologies

  HTML/CSS/JS; React/Redux/Saga; Axios; NodeJS/Express/PostgreSQL; ToneJS; Passport...

  For full dependencies list see package.JSON

## Acknowledgements

The grid and playback structures are modified direclty from Garret Bodley. Their ![step sequencer tutorial](https://medium.com/geekculture/creating-a-step-sequencer-with-tone-js-32ea3002aaf5) was enormously helpful.

I looked at Ken Wheeler's ![hooks-drum-machine](https://github.com/kenwheeler/hooks-drum-machine) and used their nifty BPM slider component.
