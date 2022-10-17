import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom' //NEW FOR PATTERN/ID

import * as Tone from 'tone';

import useBPM from "./useBPM"
import SequencerComponentReducerGrid from './SequencerComponentReducerGrid';


function SequencerSavedPattern() {
    const dispatch = useDispatch();

    const [ bpm, BPMslider ] = useBPM(120);
    const [ numSteps, setNumSteps ] = useState(8);
    // const [ selectedKit, setSelectedKit ] = useState();
    const [ patternName, setPatternName ] = useState('new pattern');

    const samples = useSelector(store=>store.samples);
    const selectedKit = useSelector(store=>store.selectedKit) //NEW FOR /PATTERN

    const params = useParams(); //NEW FOR /PATTERN/ID
    const patternId = params.id; //NEW FOR /PATTERN/ID
    


    useEffect( () => {
        dispatch({type: 'FETCH_SAMPLES'});
        dispatch({type:'FETCH_PATTERN_STEPS', payload: patternId}) //NEW FOR /PATTERN/ID
      
    },[]);

   


    console.log('kit: ',samples, selectedKit);
 

    //need to make a FETCH kits request in a useEffect.
    //fetch kits sets a reducer, which is accessed in this parent component as a menu.
    //ultimately, i will need a dropdown menu, a default kit setting, etc. for now, I will make sure the route works.

    const selectKit = (kit_id)=> {
        dispatch({type: 'SET_SELECTED_KIT', payload: kit_id})
        console.log('in selectKit', selectedKit);
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
            <input type="text" value={patternName} placeholder="new pattern" onChange={e=>setPatternName(e.target.value)} />
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
                {!samples ? null : samples.map(kit=> (
                    <button key={kit.id} onClick={e=>selectKit(e.target.value)} value={kit.id}>{kit.name}</button>
                ))}
            </div>

            {!selectedKit ? null :
            <SequencerComponentReducerGrid
                bpm = {bpm} 
                numSteps={numSteps}
                patternName={patternName}
            />
            }
        </div>
        
    )
}
export default SequencerSavedPattern;