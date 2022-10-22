import { useState } from 'react';

function StepTracker({step, isActive, beatRef}) {
    
    useState(()=>{
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

