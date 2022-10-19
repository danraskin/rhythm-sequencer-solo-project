import React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

function Guts({
        bpm,
        numSteps, 
        patternName,
        patternId, 
        grid, 
        selectedKitId,
        playing,
        setPlaying,
        armed,
        setArmed
    }) {

    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(store => store.user);
    const beatRef = useRef(0);


    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
        if (!armed) {
            console.log('in if !armed', grid[0][0])
            beatRef.current=0;
            Tone.Transport.stop()
            setPlaying(false);
        }
        if (patternId) {
            console.log('guts useEffect', patternId)
        } else {
            console.log('guts useEffect new')
        }
        console.log('guts useEffect', grid[0][0])

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
    };

    const toggleSequencePlayback = (e) => {
          if (!armed) { //this triggers Tone.start() the FIRST TIME user clicks' start.
            setArmed(true);          
            Tone.start(); //whatever's happening, this isn't triggering properly.
            Tone.getDestination().volume.rampTo(-10, 0.001)
            Tone.Transport.scheduleRepeat(triggerSample, "8n");
            console.log('in toggleSequencePayer, setArm')
            // armSequencer();
          }
      
          if (playing) {
            e.target.innerText = "Play";
            Tone.Transport.stop(); //this runs the clock, which triggers the 'repeat' function inside 'armSequencer()'
            beatRef.current=0;
            setPlaying(false);
          } else {
            beatRef.current=0;
            e.target.innerText = "Stop";
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
        console.log('in makePatternObject', patternId);
        const patternData = {
            name: patternName,
            user: user.id,
            steps_total: numSteps,
            kit_id: selectedKitId,
            pattern: pattern,
            pattern_id: patternId
        }

        return patternData;
    }

    const savePattern = () => {
        if (user.id) {
            const patternData = makePatternObject();
            if (!patternId) {
                dispatch({type: 'CREATE_PATTERN', payload: patternData});
            } else {
                dispatch({type: 'EDIT_PATTERN', payload: patternData});
            }
        } else {
            alert("Register or Login to save pattern.");
        }
    }

    const deletePattern = () => {
        dispatch({type: 'DELETE_PATTERN', payload: patternId})
        history.push('/pattern');
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
            { !patternId ? null : <button onClick={()=>deletePattern()}>Delete pattern</button>}
        </div>
    )
}

export default Guts;