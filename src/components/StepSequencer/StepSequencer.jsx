import './StepSequencer.css';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

import StepTracker from "../StepTracker/StepTracker"
import BD from "../../samples/BD.WAV";
import SD from "../../samples/TOTAL_808_SAMPLE 9_S08.WAV"

function StepSequencer() {

    //keep active for rendered components. 
    const [beatIndex, setBeatIndex] = useState(null);

    let bpm = 80;
    let beat = 0;
    const sequenceArray = setSteps(8);
    Tone.Transport.bpm.value = bpm;   

    const bdBuffer1 = new Tone.ToneAudioBuffer(BD)
    const bdBuffer2 = new Tone.ToneAudioBuffer(SD);
    const drumKit = [
        new Tone.Player(bdBuffer1),
        new Tone.Player(bdBuffer2) 
    ]
     drumKit.forEach(drum => drum.toDestination());

    function setSteps(steps) {
        const stepsArray = [];
        for (let i=1; i < steps +1 ;i++) {
            stepsArray.push({
                step: i,
                isActive: false
            });
        }
        return stepsArray;
    }
  
    const makeGrid = (drumKit) => {
        const rows = [];   
        for (const sample of drumKit) {
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push({
            step: i,
            sample: sample,
            isActive: false
            });
        }
        rows.push(row);
        }
        return rows;
    };

    const grid = makeGrid(drumKit);

    const demoPlay = () => {        
        const repeat = (time) => {
            grid.forEach((row, index) => {
              let drum = drumKit[index];
              let note = row[beat];
              if (note.isActive) {
                //drum1.triggerAttackRelease("C4", "8n", time);
                drum.start();
              }
            });
            beat = (beat + 1) % 8;

            //return to this once i start using react hooks.
            // setCurrentStepState(beat => {
            //    return beat > 6 ? 0 : beat + 1;
            // });
        }
        Tone.Transport.scheduleRepeat(repeat, "8n");
      };

    const start = () => {
        Tone.start();
        Tone.Transport.start();
        demoPlay();
    }
    const stop = () => {
        Tone.Transport.stop();
    }

    const stepToggle = (e,step) => {
        step.isActive = !step.isActive;
        e.target.className=`step  step_${step.step} active-${step.isActive}`;
        console.log(step.isActive,e.target);
    }

    return(
        <div className="App">
            <header>
                <h1>rhythm sequencer spike</h1>
            </header>
            <button><tone-button onClick={start}>Start</tone-button></button>
            <button><tone-button onClick={stop}>Stop</tone-button></button>
            {/* <input tcdype="range" min="1" max="240" width="100px" value={bpm} onChange={e=>setBPM(e.target.value)} className="slider" id="tempo"></input> */}
            <p></p>
            <section className="sequence_grid">
                {grid.map( (row,i) => (
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
                { grid[0].map(step => (
                    <StepTracker
                        key={step.step}
                        beat={beatIndex}
                        step={step}
                    />
                    
        ))}
                </div>
               
            </section>
        </div>
    )
}
export default StepSequencer;