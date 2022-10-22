import { useState, useEffect } from 'react';

function StepTracker({step, isActive, beatRef}) {
    
    // const [ beat, setBeat ] = useState (beatRef.current);
    useState(()=>{
        // setBeat(beatRef.current)
    },[beatRef])

    return(
        <div
            className={`
                step
                step_track
                step_track_${step.step}
                track_active-${isActive}`
            }
       ></div>
    );
}
export default StepTracker;

