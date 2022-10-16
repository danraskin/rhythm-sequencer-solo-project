import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

function SequencerComponent({ bpm, selectedKit, numSteps, patternName}) {
    // console.log('selectedKit', selectedKit);
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();

    //what would be like to if we used useRef for BPM???? way to prevent DOM reload?
    // const bpmRef = useRef(80);
    // bpmRef.current = 80;

    const BD = require(`../../samples/${selectedKit.BD}`);
    const SD = require(`../../samples/${selectedKit.SD}`);
    const HH = require(`../../samples/${selectedKit.HH}`);
    const beatRef = useRef(0);

    let started = false;
    let playing = false;
    
    Tone.Transport.bpm.value = bpm;

    //would be interested in making sure buffers set. inessential: for later!

    // const kitBuffers = new Tone.ToneAudioBuffers({
    //         BD: BD,
    //         SD: SD,
    //         HH: SD,
    //     }, ()=> {
    //         console.log(`In KitBuffers BD: ${kitBuffers.BD}, SD: ${kitBuffers.SD}, HH: ${kitBuffers.HH}`);
    //         const bdPlayer = new Tone.Player().toDestination;
    //         bdPlayer.buffer = kitBuffers.get("BD");
    //         const sdPlayer = new Tone.Player().toDestination;
    //         sdPlayer.buffer = kitBuffers.get("SD");
    //         const hhPlayer = new Tone.Player().toDestination;
    //         hhPlayer.buffer = kitBuffers.get("HH")

    //         const drumKit = [
    //             new Tone.Player(bdPlayer),
    //             new Tone.Player(sdPlayer),
    //             new Tone.Player(hhPlayer) 
    //         ]  

    //         grid = makeGrid(drumKit)
    //         console.log(grid);
    //     }
    // );


    const bdBuffer = new Tone.ToneAudioBuffer(BD);
    const sdBuffer = new Tone.ToneAudioBuffer(SD);
    const hhBuffer = new Tone.ToneAudioBuffer(HH);
    const drumKit = [
        new Tone.Player(bdBuffer),
        new Tone.Player(sdBuffer),
        new Tone.Player(hhBuffer) 
    ]
     drumKit.forEach(drum => drum.toDestination());
  
    const makeGrid = (drumKit) => {
        const rows = [];   
        for (const sample of drumKit) {
            const row = [];
            for (let i = 0; i < numSteps; i++) {
                row.push({
                step: i,
                sample: sample,
                isActive: false
                });
            }
            rows.push(row);
        };
        return rows;
    };


    // grid is the active object.
    const grid = makeGrid(drumKit);
    
    
    
    const demoPlay = () => {  
        const repeat = (time) => {
            grid.forEach((row, index) => {
              let drum = drumKit[index];
              let note = row[beatRef.current];
              if (note.isActive) {
                drum.start();
              }
            });
            beatRef.current = (beatRef.current + 1) % numSteps;
            // beatRef.current = beat;
            console.log(beatRef);
            // // return to this once i start using react hooks.
            // setCurrentStepState(beat => {
            //    return beat > 6 ? 0 : beat + 1;
            // });
        }
        Tone.Transport.scheduleRepeat(repeat, "8n");
      };

    const configPlayButton = (e) => {
          if (!started) {
            Tone.start();
            Tone.getDestination().volume.rampTo(-10, 0.001)
            demoPlay();
            started = true;
          }
      
          if (playing) {
            e.target.innerText = "Play";
            Tone.Transport.stop();
            beatRef.current=0;
            playing = false;
          } else {
            e.target.innerText = "Stop";
            Tone.Transport.start();
            playing = true;
          }
      };

    const stepToggle = (e,step) => {
        step.isActive = !step.isActive;
        e.target.className=`step  step_${step.step} active-${step.isActive}`;
        console.log(step.isActive,e.target);
        console.log(grid)
    }

    const makePatternObject = () => {
        // console.log(grid);

        //create pattern data object
        const pattern = {};
        //store key names for pattern object
        const drumNames = ['BD','SD','HH'];

        for ( let row of grid ) {
            const setRow = []
            for ( let step in row ) {
                setRow.push(row[step].isActive)
            }
            // for each 
            pattern[drumNames[grid.indexOf(row)]] = setRow;
        }

        const patternData = {
            name: patternName,
            user: user.id,
            steps_total: numSteps,
            kit_id: selectedKit.id,
            pattern: pattern
        }

        return patternData;
    }

    const savePattern = () => {
        if (user.id) {
            const patternData = makePatternObject();
            dispatch({type: 'CREATE_PATTERN', payload: patternData});
        } else {
            alert("Register or Login to save pattern.")
        }
    }


    console.log('grid SequencerComponent',grid);
    return (
        <div className="App">
            <button><tone-button onClick={e=>configPlayButton(e)}>Play</tone-button></button>
            <section className="sequence_grid">
                {!grid ? null : grid.map( (row,i) => (
                    <div className={`row row_${i}`} key={i}>
                        {row.map(step => (
                            <div
                                key={step.step}
                                className={`step step_${step.step} active-false`}
                                id={step.step}
                                onClick={e=>stepToggle(e,step)}
                            ></div>
                        ))}
                    </div>
                ))}
                <div className="row row_track">
                {!grid ? null : grid[0].map(step => (
                    <StepTracker
                        key={step.step}
                        step={step}
                        beat={beatRef.current}
                    />
                    
        ))}
                </div>
            </section>
            <button onClick={e=>savePattern()}>Save pattern</button>
        </div>
    )
}

export default SequencerComponent;