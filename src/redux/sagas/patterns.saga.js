import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createPattern() {
    try {
        const response = yield axios.get('/api/patterns');
        // yield put({type: 'SET_SAMPLES', payload: response.data});
    } catch (error) {
        console.log('error in createPattern',error);
    }
}

function* patternsSaga() {
    yield takeLatest('CREATE_SAMPLES', createPattern);
  }

  export default patternsSaga;