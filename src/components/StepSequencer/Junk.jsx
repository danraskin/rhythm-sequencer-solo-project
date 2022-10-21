import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom' //NEW FOR PATTERN/ID
import axios from 'axios';

import * as Tone from 'tone';

import useBPM from "./useBPM"
import Guts from './Guts';


function Junk() {
    const params = useParams();
    const patternId = params.id;
    const samples = useSelector(store=>store.samples);
    
    const [ gridX, setGrid ] = useState([])
    const [ drumKitX, setDrumKitX ] = useState([])

    const [ selectedKitId, setKitId ] = useState(1)
    const [ bpm, BPMslider ] = useBPM(120);
    const [ numSteps, setNumSteps ] = useState(8);
    const [ patternName, setPatternName ] = useState('new pattern');
    const [ playing, setPlaying ] = useState(false);
    const [ armed, setArmed ] = useState(false);

    useEffect( () => {
        // setGrid([]);
        buildGrid(patternId);
        return () => {
            // console.log('junk useEffect dismount',appContext.state);
            Tone.Transport.stop();
            // appContext.close();
            // console.log('junk useEffect dismount post dispose',appContext.state);
        }
    },[patternId,samples,numSteps]);

    const buildGrid = async () => {
        
        const sampless=samples.samplesObj
        let grid = [];
        let drumKit = []
        console.log('in buildGrid', patternId)

        if (patternId) {
            console.log('in buildGrid, patternId = true')
            const patternData = await axios.get(`api/steps/${patternId}`);
            console.log(patternData.data);
            const kit_id = patternData.data.kit_id;
            const steps = patternData.data.grid;
            const steps_total = patternData.data.steps_total;
            const name = patternData.data.name
            setNumSteps(steps_total);
            setPatternName(name);
            setKitId(kit_id); //for saving pattern
            
            drumKit = buildDrumKit(sampless, kit_id); //builds drumKit
            // console.log('in buildGrid',drumKit);
            setDrumKitX(drumKit);
            grid = formatSteps(steps, steps_total, drumKit) //makes grid!
            setGrid( grid );

            console.log('in buildGrid', grid)

        } else { //this will be for new sample
            const kit_id = 1;
            const steps_total = numSteps;
            drumKit = buildDrumKit(sampless, kit_id); //builds drumKit
            setDrumKitX(drumKit);
            grid = newGrid(steps_total, drumKit) //makes grid!
            setGrid( grid );
            // setKitId(kit_id);
        }
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
        for (const drum of drumKit){drum.toDestination()};
        return drumKit;
    }

    const formatSteps = (steps, steps_total) => {
        // console.log('in formatSteps', steps);
        const rows = []; 
        const drumKit = ['BD','SD','HH'];  
        for (const sample of drumKit) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                console.log(steps[i]);
                row.push({
                step: i,
                // sample: drumKit[sample],
                isActive: steps[i][sample]
                });
            }
            rows.push(row);
        };
        console.log('grid in formatSteps: ',rows);
        return rows
    }

    const newGrid = (steps_total) => {
        const rows = [];  
        for (let j = 0; j < 3; j++) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                row.push({
                step: i,
                // sample: drumKit[sample],
                isActive: false
                });
            }
            rows.push(row);
        };
        console.log('grid in newGrid: ',rows);
        return rows
    }

    const selectKit = (kit_id)=> {
       const drumKit = buildDrumKit(samples.samplesObj, kit_id)
        setDrumKitX(drumKit);
    
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
                { Object.entries(samples).length === 0 ? null : samples.samplesArr.map(kit=> (
                    <button key={kit.id} onClick={e=>selectKit(e.target.value)} value={kit.id}>{kit.name}</button>
                ))}
            </div>
            
            { !gridX[0] ? null :
            <Guts
                drumKit={drumKitX}
                bpm = {bpm} 
                numSteps={numSteps}
                patternName={patternName}
                grid={gridX}
                selectedKitId={selectedKitId}
                armed={armed}
                setArmed={setArmed}
                playing={playing}
                setPlaying={setPlaying}
                patternId={patternId}
            />
            }
        </div>
        
    )
}
export default Junk;