import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as Tone from 'tone';

import './StepSequencer.css';

function Guts({
        drumKit,
        bpm,
        numSteps, 
        patternName, 
        grid, 
        selectedKitId,
        playing,
        setPlaying,
        armed,
        setArmed,
        patternId,
    }) {

    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector(store => store.user); // subscribes to store.user to save pattern data
    const beatRef = useRef(0);
    const [ beat, setBeat ] = useState (beatRef.current); //not sure why i used both local state and useRef.

    useEffect(() => {
        Tone.Transport.bpm.value = bpm; // resets Tone.Transport.BPM on every load event. allows live modification of bpm. 
        // console.log('armed',armed);
        // console.log('drumKit', drumKit)
        // console.log('guts useEffect', grid[0][0])
      }, [bpm])

    const triggerSample = () => {
        //triggerSample is called on every 8th note, as tracked by Tone.Transport
        setBeat(beatRef.current); //sets beat for step tracker
        grid.forEach(row => { 
            let note = row[beatRef.current]; // finds step (grid column) by beat
            const drum = grid.indexOf(row); // finds drum (grid row) by sample index in drumKit
            if (note.isActive === 1 ) { // 1 = 'single trigger'
                // console.log(drumKit[drum]);
                drumKit[drum].start(); // triggers sample in drumKit
            } else if (note.isActive === 2) { // 'double trigger'
                // console.log(drumKit[drum]);
                drumKit[drum].start();  //triggers sample first time
                drumKit[drum].start('+16n'); //triggers sample second time one 16th note after first trigger
            };
            //   console.log(grid);
        });
        beatRef.current = (beatRef.current + 1) % numSteps; // sets beatRef
        // console.log('beat',beatRef.current);
    };

    const toggleSequencePlayback = async (e) => {
        if (!armed) { //ARMED toggle prevents multiple instances of Tone.start()
            setArmed(true);
            await Tone.start(); // creates playback context (I think? nothing can play )
          }
      
          if (playing) { //if clock is already running
            e.target.innerText = "Play";
            Tone.Transport.cancel(); // cancels repeated triggerSample() event;
            Tone.Transport.stop(); // stops clock
            setPlaying(false); 
          } else {
            e.target.innerText = "Stop";
            beatRef.current=0; // resets beat
            setBeat(beatRef.current); // resets beat
            Tone.Transport.scheduleRepeat(triggerSample, "8n"); // schedules repeated triggerSample() event; scheduleRepeat returns unique event ID, which is used to cancel event on click STOP *and* Junk.jsx re-load
            Tone.Transport.start(); //starts clock
            setPlaying(true);
          }
      };

    const stepToggle = (e,step) => {
        //logic gate to handle step status.
        const shiftOn = e.shiftKey;       
        if (shiftOn) {
            if (step.isActive != 2 ) {
                step.isActive = 2;
            } else {
                step.isActive = 1;
            }
        } else {
            if (step.isActive === 0 ) {
                step.isActive = 1;
            } else {
                step.isActive = 0;
            }
        }
        e.target.className=`step  step_${step.step} active-${step.isActive}`;
        // console.log(step.isActive,e.target);
    }

    const makePatternObject = () => {
        const pattern = {};
        const drumNames = ['BD','SD','HH']; // "steps" and "samples" database stores data by BD, SD, HH columns.

        for ( let row of grid ) {
            const setRow = [] // creates pattern grid
            for ( let step in row ) {
                setRow.push(row[step].isActive)
            }
            pattern[drumNames[grid.indexOf(row)]] = setRow; // sets pattern grid to as value of pattern.pattern. see readMe for data structure.
        }
        // console.log('in makePatternObject', patternId);

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
        <div className="sequencer_container">
            <button className="btn btn_playToggle"><tone-button onClick={e=>toggleSequencePlayback(e)}>Play</tone-button></button>
            <section className="sequence_grid">
                { Object.entries(grid).length === 0  ? null : grid.map( (row,i) => (
                    <div className={`row row_${i}`} key={i}>
                        {row.map(step => (
                            <div
                                key={step.step}
                                className={`step active-${step.isActive}`}
                                id={step.step}
                                onClick={e=>stepToggle(e,step)}
                            ></div>
                        ))}
                    </div>
                ))}
                <div className="row row_track">
                    { Object.entries(grid).length === 0 ? null : grid[0].map(step => (
                        beat === step.step ?
                            <div
                                key={step.step}
                                className={`
                                    step
                                    step_track
                                    step_track_${step.step}
                                    track_active-true`
                                }
                            ></div> :
                            <div
                                key={step.step}
                                className={`
                                    step
                                    step_track
                                    step_track_${step.step}
                                    track_active-false`
                                }
                            ></div>
                    ))}
                </div>
            </section>
            <div className="btns">
                <button className="btn btn_save" onClick={()=>savePattern()}>Save pattern</button>
                { !patternId ? null : <button className="btn btn_delete" onClick={()=>deletePattern()}>Delete pattern</button>}
            </div>
        </div>
    )
}

export default Guts;