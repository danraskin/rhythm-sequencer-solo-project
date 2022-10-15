import React, {useState, useRef} from 'react';

function BPMsetter(initialBPM) {
    const [bpm, setBPM] = useState(initialBPM);

    return [
        bpm,
        <input
        type="range"
        min="1" max="240"
        width="100px"
        value={bpm}
        onChange={e=>setBPM(e.target.value)}
        className="slider"
        id="tempo"
      />
    ];
}

export default BPMsetter;