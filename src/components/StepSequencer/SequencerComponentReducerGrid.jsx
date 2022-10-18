import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "./StepTracker"

function SequencerComponentReducerGrid({ bpm, numSteps, patternName, grid, drumArr}) {
    
    const dispatch = useDispatch();

    const user = useSelector(store => store.user);
    // const selectedKitId = useSelector(store=>store.selectedKit) //NEW FOR /PATTERN
    // const samples = useSelector(store=>store.samples);
    // const steps = useSelector(store=>store.steps);
    // const gridX = useSelector(store=>store.grid);
    // const [gridX, setGridX] = useState( ()=>makeGrid(drumKit) );
    // const [gridX, setGridX] = useState([]);



    // const [ selectedKit, setSelectedKit ] = useState(samples[0]);

    const beatRef = useRef(0);

    let started = false;
    let playing = false;
    
    Tone.Transport.bpm.value = bpm;
    
    //what would be like to if we used useRef for BPM???? way to prevent DOM reload?
    // const bpmRef = useRef(80);
    // bpmRef.current = 80;
    // useEffect(()=>{
    //     // for (let kit of samples) {
    //     //     if (kit.id === selectedKitId) {
    //     //         setSelectedKit(kit);
    //     //     }
    //     // }
    //     console.log('useEffect drumkit', drumKit);
    //     makeGrid(drumKit);

    //     // dispatch({type: 'SET_GRID', payload: makeGrid(drumKit)});
    //     console.log(gridX);

    // },[]);
 
    // const makeGrid = (drumKit) => {
    //     const rows = [];   
    //     for (const sample of drumKit) {
    //         const row = [];
    //         for (let i = 0; i < numSteps; i++) {
    //             row.push({
    //             step: i,
    //             sample: sample,
    //             isActive: false
    //             });
    //         }
    //         rows.push(row);
    //     };
    //     setGridX(rows);
    //     // return rows;
    // };

    // grid is the active object.
    
    const demoPlay = () => { 
        // console.log('gridX',gridX);

        const repeat = () => {
            grid.forEach((row, index) => {
              let drum = drumArr[index];
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
        // console.log(grid)
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

    return (
        <div className="App">
            <button><tone-button onClick={e=>configPlayButton(e)}>Play</tone-button></button>
            <section className="sequence_grid">
                { Object.entries(grid).length === 0  ? null : grid.map( (row,i) => (
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