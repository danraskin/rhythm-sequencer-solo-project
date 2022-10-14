import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import * as Tone from 'tone';

import useBPM from "./useBPM"
import SequencerComponent from './SequencerComponent';


function StepSequencer() {
    const dispatch = useDispatch();

    //need to make a FETCH kits request in a useEffect.
    //fetch kits sets a reducer, which is accessed in this parent component as a menu.
    //ultimately, i will need a dropdown menu, a default kit setting, etc. for now, I will make sure the route works.

    const samples = useSelector(store=>store.samples);
    const [ bpm, BPMslider ] = useBPM(80);
    const [ numSteps, setNumSteps ] = useState(8);
    const [ selectedKit, setSelectedKit ] = useState();

    useEffect( () => {
        dispatch({type: 'FETCH_SAMPLES'});
    },[selectedKit]);

    const selectKit = (e)=> {
        console.log('target value is',e);
        setSelectedKit(e);
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
        <div className="App">
            <header>
                <h1>rhythm sequencer</h1>
            </header>
            {BPMslider}
            <p>{bpm}</p>
            <p>Steps:<input type="text" value={numSteps} onChange={e=>setNumSteps(e.target.value)} /></p>
            {/* <form >
                <label>Drum kits</label>
                <select>
                        {samples.map(kit=> (
                            <option key={kit.id} onClick={e=>selectKit} value={kit}>{kit.name}</option>
                        ))}
                </select>
            </form> */}
            <div id="kit_selector">
                {!samples? null : samples.map(kit=> (
                    <button key={kit.id} onClick={e=>selectKit(kit)} value={kit}>{kit.name}</button>
                ))}
            </div>

            {!selectedKit ? null :
            <SequencerComponent
                bpm = {bpm} 
                BPMslider={BPMslider}
                selectedKit={selectedKit}
                numSteps={numSteps}
               
            />
            }
        </div>
        
    )
}
export default StepSequencer;