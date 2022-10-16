import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* createPattern(action) {
    try {
        // console.log('in createPattern: ', action.payload)
        const response = yield axios({
            method: 'POST',
            url: '/api/patterns',
            data: action.payload
        });
        // yield put({type: 'SET_SAMPLES', payload: response.data});

    } catch (error) {
        console.log('error in createPattern: ', error);
    }
}

function* fetchUserPatterns(action) {
    try {
        // console.log('in fetchUserPattern: ',action.payload);
        const response = yield axios.get('api/patterns/user');
        // console.log(response.data);
        yield put({ type: 'SET_USER_PATTERNS', payload: response.data });
    } catch (error) {
        console.log('error in fetchUserPatterns: ', error);
    }
}

function* patternsSaga() {
    yield takeLatest('CREATE_PATTERN', createPattern);
    yield takeLatest('FETCH_USER_PATTERNS', fetchUserPatterns)
  }

  export default patternsSaga;