import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { useDispatch } from 'react-redux'

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
    
    const patternId = action.payload;

    // const patternId = action.payload.patternId;
    // const samples = action.payload.samples;

    try {
        const response = yield axios.get(`api/steps/${patternId}`);

        console.log('in fetchPatternSteps: ', patternId, response.data);

        yield put({
            type: 'SET_PATTERN_STEPS',
            payload: response.data
        }); 

        // yield put({
        //     type: 'SET_SELECTED_KIT', //SEND TO REDUCER
        //     // type: 'SELECT_KIT', // SEND TO SAGA
        //     payload: {
        //         kit_id: response.data.kit_id,
        //         name: response.data.name,
        //         samples
        //     }});

    } catch (error) {
        console.log('error in fetchPatternSteps: ', error);
    }
}

function* stepsSaga() {
    yield takeLatest('EDIT_STEPS', editSteps);
    yield takeLatest('FETCH_PATTERN_STEPS', fetchPatternSteps);
  }

  export default stepsSaga;