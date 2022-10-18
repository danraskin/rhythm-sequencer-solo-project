import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom' //NEW FOR PATTERN/ID
import axios from 'axios';

import * as Tone from 'tone';

import useBPM from "./useBPM"
import SequencerComponentReducerGrid from './SequencerComponentReducerGrid';


function SequencerSavedPattern() {
    const dispatch = useDispatch();
    const params = useParams(); //NEW FOR /PATTERN/ID
    const patternId = params.id; //NEW FOR /PATTERN/ID
    const samples = useSelector(store=>store.samples);


    const [ bpm, BPMslider ] = useBPM(120);
    const [ numSteps, setNumSteps ] = useState(8);
    // const [ selectedKit, setSelectedKit ] = useState();
    const [ patternName, setPatternName ] = useState('new pattern');




    // useEffect( () => {
    //     console.log('in useEffect',patternId, samples);
    //     dispatch({type:'FETCH_PATTERN_STEPS', payload: {patternId, samples}}) //NEW FOR /PATTERN/ID      
    // },[]);



    const buildGrid = async () => {

        let drumKit = [];
        let stepsForGrid; 
        console.log('in buildGrid', patternId)

        if (patternId) {

            const patternData = await axios.get(`api/steps/${patternId}`);
            const sampless=samples.samplesObj
            const kit_id = patternData.data.kit_id;
            const steps = patternData.data.grid;
            const steps_total = patternData.data.steps_total;
            
            drumKit = buildDrumKit(sampless, kit_id);
            // console.log(drumKit);

            stepsForGrid = formatSteps(steps, steps_total, drumKit);

        } else {
            // kit_id = 1;
            // steps_total = 8;


        }

        //FORMATS STEPS for GRID

        //MAKES GRID

    }
       
    const buildDrumKit = (sampless, kit_id) => {
        const BD = require(`../../samples/${sampless[kit_id].BD}`);
        const SD = require(`../../samples/${sampless[kit_id].SD}`);
        const HH = require(`../../samples/${sampless[kit_id].HH}`);

        const bdBuffer = new Tone.ToneAudioBuffer(BD);
        const sdBuffer = new Tone.ToneAudioBuffer(SD);
        const hhBuffer = new Tone.ToneAudioBuffer(HH);
        
        const drumKit = [
            new Tone.Player(bdBuffer),
            new Tone.Player(sdBuffer),
            new Tone.Player(hhBuffer) 
        ]
        drumKit.forEach(drum => drum.toDestination());

        return drumKit;
    }

    const formatSteps = (steps, steps_total, drumKit) => {
        console.log('in formatSteps', steps);
        

    }

    buildGrid(patternId);


    

    // const selectKit = (kit_id)=> {
    //     // dispatch({type: 'SELECT_KIT', payload: {kit_id, samples}})
    //     dispatch({type: 'SET_SELECTED_KIT', payload: {kit_id, samples}})

    //     // console.log('in selectKit', selectedKit);
    // }

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
                { Object.entries(samples).length === 0 ? null : samples.samplesArr.map(kit=> (
                    <button key={kit.id} onClick={e=>selectKit(e.target.value)} value={kit.id}>{kit.name}</button>
                ))}
            </div>

            {/* {!selectedKit ? null :
            <SequencerComponentReducerGrid
                bpm = {bpm} 
                numSteps={numSteps}
                patternName={patternName}
            />
            } */}
        </div>
        
    )
}
export default SequencerSavedPattern;