import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom' //NEW FOR PATTERN/ID
import axios from 'axios';
import * as Tone from 'tone';

import useBPM from "./useBPM"
import SequencerComponentReducerGrid from './SequencerComponentReducerGrid';


function StepSequencer() {

    const dispatch = useDispatch();
    const params = useParams(); //NEW FOR /PATTERN/ID
    const patternId = params.id; //NEW FOR /PATTERN/ID
    const samples = useSelector(store=>store.samples);
    
    const [ gridX, setGrid ] = useState([])

    const [ selectedKitId, setKitId ] = useState('1')
    const [ bpm, BPMslider ] = useBPM(120);
    const [ numSteps, setNumSteps ] = useState(8);
    const [ patternName, setPatternName ] = useState('new pattern');
    
    // const [ drumArr, setDrumArr ] = useState([]);

    useEffect( () => {
        buildGrid();
        console.log('in useEffect', gridX);
        // console.log('in useEffect', drumArr);
    },[samples]);

    const buildGrid = async (patternId) => {
        console.log();
        
        const sampless=samples.samplesObj
        
        let grid = [];
        let drumKit = {}
        // console.log('in buildGrid', patternId)

        if (patternId) {

            const patternData = await axios.get(`api/steps/${patternId}`);
            // console.log(patternData.data);
            const kit_id = patternData.data.kit_id;
            const steps = patternData.data.grid;
            const steps_total = patternData.data.steps_total;
            const name = patternData.data.name
            setNumSteps(steps_total);
            setPatternName(name);
            setKitId(kit_id);
            
            drumKit = buildDrumKit(sampless, kit_id); //builds drumKit
            // setDrumArr( buildDrumArr(drumKit) ); //formats drumKit for use in sequencer
            // console.log('in buildGrid',drumKit);

            grid = formatSteps(steps, steps_total, drumKit) //makes grid!
            setGrid( grid );
            // console.log('in buildGrid', grid)

        } else { //this will be for new sample
            console.log('in else');
            const kit_id = 1;
            const steps_total = 8;
            drumKit = buildDrumKit(sampless, kit_id); //builds drumKit
            grid = newGrid(steps_total, drumKit) //makes grid!
            setGrid( grid );
            setKitId(kit_id);

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
        
        const drumKit = {
            BD: new Tone.Player(bdBuffer),
            SD: new Tone.Player(sdBuffer),
            HH: new Tone.Player(hhBuffer) 
        }
        for (const drum in drumKit){drumKit[drum].toDestination()};

        return drumKit;
    }

    // const buildDrumArr = (drumKit) => {
    //     //re-sets drumKit to array form for sequencer playback
    //     const drumArr = []
    //     for ( const drum in drumKit) {
    //         drumArr.push(drumKit[drum]);
    //         // console.log('in setDrumKitArray', drumKit[drum]);
    //     }
    //     return drumArr;
    // }
    

    const formatSteps = (steps, steps_total, drumKit) => {
        // console.log('in formatSteps', steps);
        const rows = [];   
        for (const sample in drumKit) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                row.push({
                step: i,
                sample: drumKit[sample],
                isActive: steps[i][sample]
                });
            }
            rows.push(row);
        };
        // console.log('grid in formatSteps: ',rows);
        return rows
    }

    const newGrid = (steps_total, drumKit) => {
        const rows = [];   
        for (const sample in drumKit) {
            // console.log('sample in drumKit', sample, drumKit[sample]);
            const row = [];
            for (let i = 0; i < steps_total; i++) {
                row.push({
                step: i,
                sample: drumKit[sample],
                isActive: false
                });
            }
            rows.push(row);
        };
        // console.log('grid in formatSteps: ',rows);
        return rows
    }

    const selectKit = (kit_id)=> {
        // Tone.start();
        // console.log(drumArr[0].start());
        // dispatch({type: 'SELECT_KIT', payload: {kit_id, samples}})
        // dispatch({type: 'SET_SELECTED_KIT', payload: {kit_id, samples}})

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
                { Object.entries(samples).length === 0 ? null : samples.samplesArr.map(kit=> (
                    <button key={kit.id} onClick={e=>selectKit(e.target.value)} value={kit.id}>{kit.name}</button>
                ))}
            </div>

            { !gridX[0] ? null :
            <SequencerComponentReducerGrid
                bpm = {bpm}
                numSteps={numSteps}
                patternName={patternName}
                grid={gridX}
                selectedKitId={selectedKitId}
            />
            }
        </div>
        
    )
}



//     const dispatch = useDispatch();

//     //need to make a FETCH kits request in a useEffect.
//     //fetch kits sets a reducer, which is accessed in this parent component as a menu.
//     //ultimately, i will need a dropdown menu, a default kit setting, etc. for now, I will make sure the route works.

//     const samples = useSelector(store=>store.samples);
//     const [ bpm, BPMslider ] = useBPM(120);
//     const [ numSteps, setNumSteps ] = useState(8);
//     const [ selectedKit, setSelectedKit ] = useState();
//     const [ patternName, setPatternName ] = useState('new pattern');

//     useEffect( () => {
//         dispatch({type: 'FETCH_SAMPLES'});
//     },[]);

//     const selectKit = (e)=> {
//         console.log('target value is',e);
//         setSelectedKit(e);
//     }


//     // const drumKit= [];
//     // let grid=[];
    

// //     useEffect(

// //         //might have to exploit SAGAS or REDUCERS to do this pre-loaded rendering.

// //         () => {const kitBuffers = new Tone.ToneAudioBuffers({
// //             urls: {
// //                 BD,
// //                 SD
// //             },
// //             onload: ()=> {
// //                 console.log('in bdBuffer1 function');
// //                 const drum1 = new Tone.Player().toDestination();
// //                 drum1.buffer = kitBuffers.get("BD");
// //                 const drum2 = new Tone.Player(SD).toDestination();
// //                 drum2.buffer = kitBuffers.get("SD");
// //                 drumKit.push(drum1,drum2);

// //                 grid = makeGrid(drumKit);
// //                 console.log('grid: ',grid);
// //             }
// //         })}
// //   , []);




// // SequencerComponent props: BPM and BPMslider are inputs from another nested component that
// // access REACT state.
// // grid is the "array of arrays of objects" that both renders on DOM in SequencerComponent
// // and is called in the 'demoPlay()' to trigger samples.

//     return(
//         <div className="App">
//             <header>
//                 <h1>rhythm sequencer</h1>
//             </header>
//             <input type="text" value={patternName} placeholder="new pattern" onChange={e=>setPatternName(e.target.value)} />
//             {BPMslider}
//             <p>{bpm}</p>
//             <p>Steps:<input type="text" value={numSteps} onChange={e=>setNumSteps(e.target.value)} /></p>
//             {/* <form >
//                 <label>Drum kits</label>
//                 <select>
//                         {samples.map(kit=> (
//                             <option key={kit.id} onClick={e=>selectKit} value={kit}>{kit.name}</option>
//                         ))}
//                 </select>
//             </form> */}
//             <div id="kit_selector">
//                 { Object.entries(samples).length === 0 ? null : samples.samplesArr.map(kit=> (
//                     <button key={kit.id} onClick={e=>selectKit(e.target.value)} value={kit.id}>{kit.name}</button>
//                 ))}
//             </div>

//             {!selectedKit ? null :
//             <SequencerComponent
//                 bpm = {bpm} 
//                 BPMslider={BPMslider}
//                 selectedKit={selectedKit}
//                 numSteps={numSteps}
//                 patternName={patternName}
               
//             />
//             }
//         </div>
        
//     )
// }
export default StepSequencer;