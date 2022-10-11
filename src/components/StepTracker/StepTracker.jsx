import { useState, useEffect } from 'react';

function StepTracker({beatIndex,step}) {

    const[stepTracker, setStepTracker]=useState(null);

    return(
        <div
            className={`
                step
                step_track
                step_track_${step.step}
                track_active-false`}
       ></div>
    );
}
export default StepTracker;

