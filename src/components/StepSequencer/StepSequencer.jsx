import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

import useBPM from "./useBPM"
import SequencerComponent from './SequencerComponent';
import BD1 from "../../samples/BD.WAV";
import SD1 from "../../samples/TOTAL_808_SAMPLE 9_S08.WAV"
import SD2 from "../../samples/TOTAL_808_SAMPLE 23_S22.WAV"
import BD2 from "../../samples/TOTAL_808_SAMPLE 26_S25.WAV"

function StepSequencer() {

    const [ bpm, BPMslider] = useBPM(80);

    const kit1 = {
        BD: BD1,
        SD: SD1
    }

    const kit2 = {
        BD: BD2,
        SD: SD2
    }


    // const drumKit= [];
    // let grid=[];
    

//     useEffect(

//         //might have to exploit SAGAS or REDUCERS to do this pre-loaded rendering.

//         () => {const kitBuffers = new Tone.ToneAudioBuffers({
//             urls: {
//                 BD,
//                 SD
//             },
//             onload: ()=> {
//                 console.log('in bdBuffer1 function');
//                 const drum1 = new Tone.Player().toDestination();
//                 drum1.buffer = kitBuffers.get("BD");
//                 const drum2 = new Tone.Player(SD).toDestination();
//                 drum2.buffer = kitBuffers.get("SD");
//                 drumKit.push(drum1,drum2);

//                 grid = makeGrid(drumKit);
//                 console.log('grid: ',grid);
//             }
//         })}
//   , []);




// SequencerComponent props: BPM and BPMslider are inputs from another nested component that
// access REACT state.
// grid is the "array of arrays of objects" that both renders on DOM in SequencerComponent
// and is called in the 'demoPlay()' to trigger samples.


    return(
        <div>
            <SequencerComponent
                bpm = {bpm} 
                BPMslider={BPMslider}
                selectedKit={kit1}
               
            />
        </div>
        
    )
}
export default StepSequencer;