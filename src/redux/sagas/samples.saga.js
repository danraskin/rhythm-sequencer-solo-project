import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchSamples() {
    try {
        const response = yield axios.get('/api/samples');
        yield put({type: 'SET_SAMPLES' ,payload: response.data});
    } catch (error) {
        console.log('error in fetchSamples',error);
    }
}

function* samplesSaga() {
    yield takeLatest('FETCH_SAMPLES', fetchSamples);
  }

  export default samplesSaga;