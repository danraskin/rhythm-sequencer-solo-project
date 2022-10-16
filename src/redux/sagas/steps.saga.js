import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* editSteps(action) {
    // PUT
    // try {
    //     // console.log('in createPattern: ', action.payload)
    //     const response = yield axios({
    //         method: 'POST',
    //         url: '/api/patterns',
    //         data: action.payload
    //     });
    //     // yield put({type: 'SET_SAMPLES', payload: response.data});

    // } catch (error) {
    //     console.log('error in createPattern: ', error);
    // }
}

function* fetchPatternSteps(action) {
    try {
        const response = yield axios.get(`api/steps/${action.payload}`);
        // console.log('in fetchPatternSteps: ', response.data);
        yield put({ type: 'SET_PATTERN_STEPS', payload: response.data });
    } catch (error) {
        console.log('error in fetchPatternSteps: ', error);
    }
}

function* stepsSaga() {
    yield takeLatest('EDIT_STEPS', editSteps);
    yield takeLatest('FETCH_PATTERN_STEPS', fetchPatternSteps)
  }

  export default stepsSaga;