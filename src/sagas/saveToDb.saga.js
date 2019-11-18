import {takeEvery, select} from 'redux-saga/effects';
import {CALCULATE_SUCCESS} from '../actionTypes/calculation';
import firestore from '@react-native-firebase/firestore';

function* handler(action) {
  const user = yield select(state => state.auth);
  const userId = (user && user.uid) || '';
  const now = Date.now();
  yield firestore()
    .collection('results')
    .add({
      userId,
      createdAt: now,
      updatedAt: now,
      ...action.data,
      deleted: false,
    });
}

export default function*() {
  yield takeEvery(CALCULATE_SUCCESS, handler);
}
