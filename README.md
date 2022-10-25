
# React/ToneJS Drum Machine

  A sample-based step-sequencer for in-brower use built using React and ToneJS. I built this in 2.5 weeks as a solo project for Prime Digital Academy, an accelerated full-stack software engineering program. The sequencer integrates ToneJS into the react-redux-saga/node/postgreSQL stack taught in the Prime curriculum. It is my first full-stack application, built in the third month of an accelerated full-stack software engineering progam.

![Screen Shot 2022-10-24 at 6 12 03 PM](https://user-images.githubusercontent.com/104224468/197886282-3505e6fa-8e39-48ea-800b-7580a372f1f1.png)

## Using the Sequencer

  It's a basic tool. users first navigate to a new pattern page, (/pattern) where they can access the full functionality of the sequencer. if they want to save a pattern, they must login or register via the navbar. Once logged in, users can save, access, edit or delete patterns. Database stores sequence length, step status, pattern name, and most recently selected drumKit. BPM is automatically reset to 120 when navigating to either a new or saved pattern from any page.

  * SHIFT + CLICK to set step status to 'double trigger'
  * things might get freaky when users navigate to a new or saved pattern without *stopping* the clock/sequencer. if this happens, stop -> start or refresh.

## Deployment



## Design Concepts/Notes

* Overview 
    There are some excellent browser drum machines already available, and none serve the needs of serious music-making. Building one from scratch with a new stack allowed me to concentrate on the most minimal functions *i* need for a single instrument to feel generative and fun to use. They are:

    1. setting step count/time signature
    2. constructing and editing sequence while clock is running
    3. modifing BPM while sequence is playing
    4. *good* sounds.
    5. visual representation of step position.
    6. minimal interface.

  - setting a double trigger is only unique function of this machine, and considerably improves its playability.
  - kits used for testing/demo: three samples per kit is minimum for dynamic rhythms. 808 kits are carelessly assembled from a Roland TR-808 sample pack.'conrete 1' and 'concrete 2' more carefully assembled from my personal library of recordigs and improvisations..

* Visual Design

    err... not where i want to be. the simpler it is, the fewer opportunities there are for bad questionable decisions.

* Data management

    Project parameters required data to be created, retrieved, updated and deleted by users (*C*R*U*D*). While password and login AUTH is inessential to the functionality of the app, it met the criteria of the project.

# The 🦑 🦗 GUTS 🦐 🐙 

   I hope that a detailed description of this code can help orient anybody searching for tips on how to build a step-sequencer using React and ToneJS can learn from it.

* ARCHITECTURE

    The main app components live in /src/StepSequencer. There are two primary components: Junk.jsx and Guts.jsx.
    Junk is the parent compont.
      - data from server is accessed here and transformed into sequencer grid array and drumKit array. (/pattern) navigates to renders junk.jsx component, where a new 8-step grid is created, and a drumKit with samples from the TR808-1 kit are set as default. If user selects a saved pattern, (/pattern/id), pattern ID is sent server url and used to fetch stored pattern data.
      - BuildGrid() function is determined by whether or not patternId resolves as  true, which is determined by whether or not page is accessed with an '/id' (useParams).
      - if user selects a different drum kit from dropdown menu, 'makeDrumKit()' makes a new drumKit array.
      - BPM slider, pattern name, and sequence length are set here.

    Most values from 'Junk' are passed as props to 'Guts'. Guts is responsible for rendering the grid, setting step status (single trigger, double trigger, or inactive), sample playback, and the dispatching new saved data to saga functions.

* Data Management
   Originally, I attempted to route all data retrievals through Redux-Sagas, and to store all data used by components in Redux reducers. I ran into enough many problems with sequencing component renders after data was available in redux store that I backtracked, and set most active parameters to local React state using React Hooks (see below). User, sample, and saved pattern data are retrieved from database by Axios requests in saga functions; step data for specific patterns are retrieved by Axios request in main sequencer component ("Junk")

* REACT HOOKS

* REDUX/SAGAS

* DATA STRUCTURES

  - 'grid' array is primary data structure used by app. 

      [ 
      [ {...}, {...}, {...}, {...} ],
      [ {...}, {...}, {...}, {...} ],
      [ {...}, {...}, {...}, {...} ]
      ]
    where grid[x] = row and grid[x][y] = step

    where step is
    {
      isActive: [0/1/2],
      step: [y]
    }

  - 'drumKit' array is and array of ToneJS players
    [
      Tone.Player(BD),
      Tone.Player(SD),
      Tone.Player(HH)
    ]

  - grid and drumKit are created in 'Junk.jsx' on DOM load and passed to 'Guts.jsx' as prop.

  - data from server
    data is passed to and from server in various forms. This stuff is legible, but probably not worth explicating in the readme.md. ci

* Tone Playback

    - Set Sample Objects with Tone.Buffer and Tone.Player ('Junk.jsx')
      Don't quite understand what distinguishes Buffers and Players, but together, they create a playable object that can trigger .WAV playbacks. (it's possible buffers do not need to be defined).

      Tone.Players are created by buildDrumKit() in 'Junks.jsx', stored in an array as DrumKit and sent as prop to 'Guts.jsx.'

    - Playback with Tone.start() and Tone.Transport ('Guts.jsx')
      Playback is controlled by ToggleSequencePlayback in 'Guts.jsx'.

    - *Tone.start()*, triggered by a specific user action, is required for any    audioplayback. Functionally, can only be called *once* per Junk.jsx load. this is managed with a logic gate and the 'armed' boolean.

    * Tone.Transport.start(), Tone.Transport.stop() and Tone.Transport.    scheduleRepeat()* are also handled in ToggleSequencePlayback() via logic  gate  with 'playing' boolean.

    - *scheduleRepeat(triggerSample(),"8n")* schedules an Event: 'triggerSample()'  to occur every 8th note count within the Tone.Transport clock.

    - scheduleRepeat() Returns a unique event ID (see ToneJS documentations). 'repeater' variable saves event id to state. 
    Tone.Transport.cancel(repeater) cancels the event. Without cancelling, multiple 'scheduleRepeat' events stack on top of each other, triggering multiple patterns to play at once. it gets ugly.

    - *triggerSample()* function takes uses current step (beatRef.current) to read 'isActive' value in a given step position in the 'grid' array. if isActive = 1 or 2, Sample.start() triggers the drum sample in 'drumKit' array that matches the row of selected step in 'grid' array.

## Technologies

  HTML/CSS/JS; React/Redux/Saga; Axios; NodeJS/Express/PostgreSQL; ToneJS; Passport...

  For full dependencies list see package.JSON

## Acknowledgements
