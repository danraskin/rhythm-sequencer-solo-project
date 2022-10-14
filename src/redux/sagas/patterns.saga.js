import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createPattern(action) {
    try {
        console.log(action.payload)
        const response = yield axios({
            method: 'POST',
            url: '/api/patterns',
            data: action.payload
        });
        // yield put({type: 'SET_SAMPLES', payload: response.data});

    } catch (error) {
        console.log('error in createPattern',error);
    }
}

function* patternsSaga() {
    yield takeLatest('CREATE_PATTERN', createPattern);
  }

  export default patternsSaga;