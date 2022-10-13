import React from 'react';
import { useState, useEffect, useRef } from 'react';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "../StepTracker/StepTracker"

function SequencerComponent({ bpm, selectedKit, numSteps}) {

    //what would be like to if we used useRef for BPM???? way to prevent DOM reload?
    // const bpmRef = useRef(80);
    // bpmRef.current = 80;

    console.log('loaded Step Sequencer');

        const BD = require(`../../samples/${selectedKit.BD}`);
        const SD = require(`../../samples/${selectedKit.SD}`);
        const HH = require(`../../samples/${selectedKit.HH}`);

    let started = false;
    let playing = false;
    let beat = 0;
    // let grid;
    // const sequenceArray = setSteps(numSteps);
    Tone.Transport.bpm.value = bpm;

    // const kitBuffers = new Tone.ToneAudioBuffers({
    //     urls: {
    //         kitBD: BD1,
    //         kitSD: SD1,
    //         kitHH: HH1,
    //     },
    //     // baseUrl: "../../samples/",
    //     onload: ()=> {

    //         const bdPlayer = new Tone.Player().toDestination;
    //         bdPlayer.buffer = kitBuffers.get(kitBD);
    //         const sdPlayer = new Tone.Player().toDestination;
    //         sdPlayer.buffer = kitBuffers.get(kitSD);
    //         const hhPlayer = new Tone.Player().toDestination;
    //         hhPlayer.buffer = kitBuffers.get(kitHH)

    //         const drumKit = [
    //             new Tone.Player(bdBuffer),
    //             new Tone.Player(sdBuffer),
    //             new Tone.Player(hhBuffer) 
    //         ]  

    //         console.log('drumKit in kitBuffers', drumKit);
    //         grid = makeGrid(drumKit)
    //         console.log('grid in kitBuffers',grid);
    //     }
    // });
    const bdBuffer = new Tone.ToneAudioBuffer(BD);
    const sdBuffer = new Tone.ToneAudioBuffer(SD);
    const hhBuffer = new Tone.ToneAudioBuffer(HH);
    const drumKit = [
        new Tone.Player(bdBuffer),
        new Tone.Player(sdBuffer),
        new Tone.Player(hhBuffer) 
    ]
     drumKit.forEach(drum => drum.toDestination());


    // function setSteps(steps) {
    //     const stepsArray = [];
    //     for (let i=1; i < steps +1 ;i++) {
    //         stepsArray.push({
    //             step: i,
    //             isActive: false
    //         });
    //     }
    //     return stepsArray;
    // }
  
    const makeGrid = (drumKit) => {
        console.log('grid in makeGrid',grid)
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
            beat = (beat + 1) % numSteps;

            // // return to this once i start using react hooks.
            // setCurrentStepState(beat => {
            //    return beat > 6 ? 0 : beat + 1;
            // });

            //testing sans DOM
            // drumKit[0].start();

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
            beat=0;
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
    }

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
                    />
                    
        ))}
                </div>
            
            </section>
        </div>
    )
}

export default SequencerComponent;