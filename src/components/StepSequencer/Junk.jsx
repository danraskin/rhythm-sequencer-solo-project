import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom' 
import axios from 'axios';
import * as Tone from 'tone';

import useBPM from "./useBPM"
import Guts from './Guts';


function Junk() {
    const dispatch = useDispatch();
    const params = useParams();
    const patternId = params.id;
    const samples = useSelector(store=>store.samples);
    const user = useSelector(store => store.user);
    
    // lots of local state. some of this could probably get moved to reducers?
    const [ gridX, setGrid ] = useState([]);
    const [ drumKitX, setDrumKitX ] = useState([]);
    const [ selectedKitId, setKitId ] = useState(1);
    const [ bpm, BPMslider ] = useBPM(120);
    const [ numSteps, setNumSteps ] = useState(8);
    const [ patternName, setPatternName ] = useState('new pattern');
    const [ playing, setPlaying ] = useState(false);
    const [ armed, setArmed ] = useState(false);
    const [ repeater, setRepeater ] = useState();

    useEffect( () => {
        buildGrid(patternId); //builds grid on page load.
        return () => {
            Tone.Transport.stop(); // if user navigates to new page (saved sample or new pattern), stops transport.
            Tone.Transport.cancel(repeater);
        }
    },[patternId,samples,numSteps]);

    const buildGrid = async () => {
        
        const sampless=samples.samplesObj
        let grid = [];
        let drumKit = []

        if (patternId) {
            const patternData = await axios.get(`api/steps/${patternId}`); // have tried to move patternData to a reducer, but run into rendering issues. keeping async functions linear in the component,keeps things working.
            const kit_id = patternData.data.kit_id;
            const steps = patternData.data.grid;
            const steps_total = patternData.data.steps_total;
            const name = patternData.data.name
            setNumSteps(steps_total);
            setPatternName(name);
            setKitId(kit_id); //for saving pattern
            
            drumKit = buildDrumKit(sampless, kit_id); // builds drumKit
            setDrumKitX(drumKit);
            grid = formatSteps(steps, steps_total, drumKit) //makes grid!
            setGrid( grid );

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
        // console.log(sampless[kit_id].BD, kit_id);
        const BD = require(`../../samples/${sampless[kit_id].BD}`);
        const SD = require(`../../samples/${sampless[kit_id].SD}`);
        const HH = require(`../../samples/${sampless[kit_id].HH}`);

        // const bdBuffer = new Tone.ToneAudioBuffer(BD);
        // const sdBuffer = new Tone.ToneAudioBuffer(SD);
        // const hhBuffer = new Tone.ToneAudioBuffer(HH);
        // i'm not sure i actually need to define buffers separately from players!
        const drumKit = [
            // new Tone.Player(bdBuffer),
            // new Tone.Player(sdBuffer),
            // new Tone.Player(hhBuffer) 
            new Tone.Player(BD),
            new Tone.Player(SD),
            new Tone.Player(HH) 
    ]
        for (const drum of drumKit){drum.toDestination()}; // links each PLAYER to audio output
        return drumKit;
    }

    const formatSteps = (steps, steps_total) => {
        // formats steps data from database to fit in GRID
        const rows = []; 
        const drumKit = ['BD','SD','HH']; // dummy array for structuring grid
        for (const sample of drumKit) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                row.push({
                    step: i,
                    isActive: steps[i][sample]
                });
            }
            rows.push(row);
        };
        // console.log('grid in formatSteps: ',rows);
        return rows //rows is grid
    }

    const newGrid = (steps_total) => {
        // creates new grid with no steps data
        const rows = [];  
        for (let j = 0; j < 3; j++) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                row.push({
                step: i,
                isActive: 0
                });
            }
            rows.push(row);
        };
        // console.log('grid in newGrid: ',rows);
        return rows // rows is grid
    }

    const selectKit = (kit_id)=> {
        // SHOULD DRUMKIT GET SENT TO A REDUCER?
        // console.log(kit_id);
        const drumKit = buildDrumKit(samples.samplesObj, kit_id)
        setDrumKitX(drumKit)
        setKitId(kit_id);
    }

    return(
        <div className="App">
            <header>
                <h1>rhythm sequencer</h1>
            </header>
            <div className="control_panel">
                <div className="settings">
                    <p>Steps:
                        <input
                            type="text"
                            id="stepCount"
                            value={numSteps}
                            onChange={e=>setNumSteps(e.target.value)}
                            disabled={patternId ? true : false}
                        /></p>
                    <form
                        id="kitSelector"
                        onChange={e=>selectKit(e.target.value)}>
                        <label>Sample kits</label>
                        <select>
                                {Object.entries(samples).length === 0 ? null : samples.samplesArr.map(kit=> (
                                    <option key={kit.id}  value={kit.id}>{kit.name}</option>
                                ))}
                        </select>
                    </form>
                </div>
                <div className="details">
                    { user ? <p>{user.username}</p> : null }
                    <p>pattern name: </p>
                    <input
                        type="text"
                        id="patternName"
                        value={patternName}
                        placeholder="new pattern"
                        onChange={e=>setPatternName(e.target.value)}
                    />
                </div>
                <div className="controls">
                    <p>BPM: {BPMslider} {bpm}</p>
                </div>
                
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
                    repeater={repeater}
                    setRepeater={setRepeater}
                />
            }
        </div>
        
    )
}
export default Junk;