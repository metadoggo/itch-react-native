import {takeEvery, select, put} from 'redux-saga/effects';
import {
  CALCULATION_DELETE_REQUEST,
  DELETE_RESULT_SUCCESS,
} from '../actionTypes/calculation';
import {createAction} from '../actions';

function* handler(action) {
  console.log('deleting ' + action.data);
  const calculation = yield select(state => state.calculation);
  const result = calculation[action.data];
  const now = Date.now();
  yield result.docRef.update({
    updateAd: now,
    deleted: true,
  });
  yield put(createAction(DELETE_RESULT_SUCCESS, action.data));
}

export default function*() {
  yield takeEvery(CALCULATION_DELETE_REQUEST, handler);
}
