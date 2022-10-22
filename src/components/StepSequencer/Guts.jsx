import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

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
    const user = useSelector(store => store.user);
    const beatRef = useRef(0);
    const [ beat, setBeat ] = useState (beatRef.current);

    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
        console.log('armed',armed);
        // console.log('drumKit', drumKit)

        console.log('guts useEffect', grid[0][0])
        
        return () => {
            // Tone.Transport.stop();

            // beatRef.current=0;
            console.log('guts useEffect stopping');
        }
      }, [bpm])

    const triggerSample = () => {
        setBeat(beatRef.current); //sets beat for step tracker
        grid.forEach(row => {
            let note = row[beatRef.current];
            const drum = grid.indexOf(row);
            if (note.isActive === 1 ) {
                // console.log(drumKit[drum]);
                drumKit[drum].start();
            } else if (note.isActive === 2) {
                // console.log(drumKit[drum]);
                drumKit[drum].start();
                drumKit[drum].start('+16n');
            };
            //   console.log(grid);
        });
        beatRef.current = (beatRef.current + 1) % numSteps;
        // console.log('beat',beatRef.current);
    };

    const toggleSequencePlayback = async (e) => {
        let repeater; //unique event ID;
        if (!armed) { //ARMED toggle prevents multiple instances of Tone.start()
            setArmed(true);  
            await Tone.start();
          }
      
          if (playing) { //if clock is already running
            e.target.innerText = "Play";
            Tone.Transport.cancel(repeater);//cancles repeated triggerSample() event;
            Tone.Transport.stop(); //stops clock
            setPlaying(false); 
          } else {
            e.target.innerText = "Stop";
            beatRef.current=0; // resets beat
            setBeat(beatRef.current);
            repeater = Tone.Transport.scheduleRepeat(triggerSample, "8n"); //schedules repeated triggerSample() event;
            // console.log('in toggleSequencePayer',repeater)
            Tone.Transport.start(); //starts clock
            setPlaying(true);
          }
      };

    const stepToggle = (e,step) => {
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
                        beatRef.current === step.step ?
                            <StepTracker
                                key={step.step}
                                step={step}
                                isActive={true}
                                beatRef={beat}
                            /> :
                            <StepTracker
                                key={step.step}
                                step={step}
                                isActive={false}
                                beatRef={beat}
                            />
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