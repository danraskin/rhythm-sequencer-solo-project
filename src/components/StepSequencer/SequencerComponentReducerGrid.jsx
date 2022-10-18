import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

function SequencerComponentReducerGrid({ bpm, numSteps, patternName, grid, drumArr}) {
    
    const dispatch = useDispatch();
    const user = useSelector(store => store.user);
    const beatRef = useRef(0);

    let started = false;
    let playing = false;
    
    Tone.Transport.bpm.value = bpm;
    console.log(grid)
    
    
    const demoPlay = () => { 
        console.log('in demoPlay', drumArr);

        const repeat = (time) => {
            grid.forEach((row, index) => {
              let drum = drumArr[index];
              let note = row[beatRef.current];
              if (note.isActive) {
                drum.start();
              }
            });
            beatRef.current = (beatRef.current + 1) % numSteps;
            console.log(beatRef);

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
        // console.log(grid)
    }

    const makePatternObject = () => {
        const pattern = {};
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

    return (
        <div className="App">
            <button><tone-button onClick={e=>configPlayButton(e)}>Play</tone-button></button>
            <section className="sequence_grid">
                { Object.entries(grid).length === 0  ? null : grid.map( (row,i) => (
                    <div className={`row row_${i}`} key={i}>
                        {row.map(step => (
                            <div
                                key={step.step}
                                className={`step step_${step.step} active-${step.isActive}`}
                                id={step.step}
                                onClick={e=>stepToggle(e,step)}
                            ></div>
                        ))}
                    </div>
                ))}
                <div className="row row_track">
                { Object.entries(grid).length === 0 ? null : grid[0].map(step => (
                    <StepTracker
                        key={step.step}
                        step={step}
                        beat={beatRef.current}
                    />
                    
        ))}
                </div>
            </section>
            <button onClick={()=>savePattern()}>Save pattern</button>
        </div>
    )
}

export default SequencerComponentReducerGrid;