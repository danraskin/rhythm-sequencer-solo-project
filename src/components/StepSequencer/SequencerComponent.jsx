import React from 'react';
import { useState, useEffect, useRef } from 'react';

import * as Tone from 'tone';

import './StepSequencer.css';
import StepTracker from "../StepTracker/StepTracker"



function SequencerComponent({ bpm, BPMslider, selectedKit }) {

    console.log('loaded Step Sequencer');

    const {BD, SD} = selectedKit;

    let started = false;
    let playing = false;
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

console.log(drumKit);
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
            beat = (beat + 1) % 8;

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
            <header>
                <h1>rhythm sequencer spike</h1>
            </header>
            <button><tone-button onClick={e=>configPlayButton(e)}>Play</tone-button></button>
            {BPMslider}

            <p>{bpm}</p>
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
                {grid[0].map(step => (
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