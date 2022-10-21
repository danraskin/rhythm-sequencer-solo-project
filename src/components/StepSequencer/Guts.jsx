import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

function Guts({
    appContext,
    bpm,
    numSteps, 
    patternName, 
    grid, 
    selectedKitId,
    playing,
    setPlaying,
    armed,
    setArmed,
}) {
    
    const dispatch = useDispatch();
    const user = useSelector(store => store.user);
    const beatRef = useRef(0);


    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
        console.log('armed',armed);
        if (!armed) {
            console.log('in if !armed', grid[0][0])
            // setPlaying(false);
        }
        console.log('guts useEffect', grid[0][0])
        
        return () => {
            // Tone.Transport.stop();

            beatRef.current=0;
            console.log('guts useEffect stopping');
        }

      }, [bpm])

      const triggerSample = () => {
        grid.forEach(row => {
          let note = row[beatRef.current];
          if (note.isActive) {
            note.sample.start();
            console.log(grid); // how is GRID doubled???
          }
        });
        beatRef.current = (beatRef.current + 1) % numSteps;
        console.log('beat',beatRef.current);
    }

    const toggleSequencePlayback = async (e) => {
          if (!armed) { //this triggers Tone.start() the FIRST TIME user clicks' start.
            setArmed(true);  
            await appContext.start(); //whatever's happening, this isn't triggering properly.
            Tone.Transport.scheduleRepeat(triggerSample, "8n");
            console.log('in toggleSequencePayer, setArm')
            // armSequencer();
          }
      
          if (playing) {
            e.target.innerText = "Play";
            // beatRef.current=0;
            Tone.Transport.stop(); //this runs the clock, which triggers the 'repeat' function inside 'armSequencer()'
            setPlaying(false);
          } else {
            e.target.innerText = "Stop";
            beatRef.current=0;
            Tone.Transport.start();
            setPlaying(true);
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
//needs to know KIT. this was used to make the grid, and not stored anywhere.
        console.log('makePatternObject', selectedKitId);
        const patternData = {
            name: patternName,
            user: user.id,
            steps_total: numSteps,
            kit_id: selectedKitId,
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
            <button><tone-button onClick={e=>toggleSequencePlayback(e)}>Play</tone-button></button>
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

export default Guts;