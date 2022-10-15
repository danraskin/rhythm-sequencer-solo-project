import { useState, useEffect } from 'react';

function StepTracker({step, beat}) {

    // const stepLight = () => {
    //     if (beat === step.step) {
    //         console.log('something!');
    //     }
    // }

    return(
        <div
            className={`
                step
                step_track
                step_track_${step.step}
                track_active-false`
            }
       ></div>
    );
}
export default StepTracker;

