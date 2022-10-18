import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import * as Tone from 'tone';

function* fetchSamples() {
    try {
        const response = yield axios.get('/api/samples');
        yield put({type: 'SET_SAMPLES' ,payload: response.data});
    } catch (error) {
        console.log('error in fetchSamples',error);
    }
}

function* selectKit(action) {
    for (let kit of action.payload.samples) {
        if (Number(action.payload.kit_id) === kit.id) {
            const selectedKit = kit;
          console.log('in SELECT_KIT saga', kit.id)

          yield put({type: 'SET_SELECTED_KIT', payload: kit});
        }
      }
}

function* createBuffers(action) {
    console.log('setBuffers', action.payload)
    const buffers = action.payload

    const bdBuffer = new Tone.ToneAudioBuffer(buffers.BD);
    const sdBuffer = new Tone.ToneAudioBuffer(buffers.SD);
    const hhBuffer = new Tone.ToneAudioBuffer(buffers.HH);

    const drumKit = [
        new Tone.Player(bdBuffer),
        new Tone.Player(sdBuffer),
        new Tone.Player(hhBuffer) 
    ]
    drumKit.forEach(drum => drum.toDestination());

    yield put ({type: 'SET_BUFFERS', payload: drumKit})
    console.log('createBuffers',drumKit);
}

function* samplesSaga() {
    yield takeLatest('FETCH_SAMPLES', fetchSamples);
    yield takeLatest('SELECT_KIT', selectKit);
    yield takeLatest('CREATE_BUFFERS', createBuffers)
  }

  export default samplesSaga;