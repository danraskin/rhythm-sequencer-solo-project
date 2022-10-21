import { useState, useEffect } from 'react';

function StepTracker({step, isActive}) {

// useEffect( () => {
    
// },[isActive])

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

