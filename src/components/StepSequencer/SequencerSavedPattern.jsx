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
        console.log('in useEffect',patternId, samples);
        dispatch({type:'FETCH_PATTERN_STEPS', payload: {patternId, samples}}) //NEW FOR /PATTERN/ID      
    },[]);



    const selectKit = (kit_id)=> {
        dispatch({type: 'SET_SELECTED_KIT', payload: {kit_id, samples}})
        // console.log('in selectKit', selectedKit);
    }



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