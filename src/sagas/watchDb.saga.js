import {put, take, takeEvery} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {USER_CHANGED} from '../actionTypes/auth';
import {RESULT_LOADED} from '../actionTypes/calculation';
import {createAction} from '../actions';
import firestore from '@react-native-firebase/firestore';
import {setParams} from '../components/NavigationService';

function* handler(action) {
  if (!action.data) {
    return;
  }

  const ch = eventChannel(emit =>
    firestore()
      .collection('results')
      .where('userId', '==', action.data.uid)
      .where('deleted', '==', false)
      .orderBy('updatedAt', 'desc')
      .onSnapshot({
        error: e => console.log(e),
        next: snap => {
          if (snap.docs.length) {
            const results = snap.docs.map(doc => ({
              ref: doc.ref,
              ...doc.data(),
            }));
            setParams({params: {badge: results.length}, key: 'Result'});
            emit(results);
          }
        },
      }),
  );

  while (true) {
    yield put(createAction(RESULT_LOADED, yield take(ch)));
  }
}

export default function*() {
  yield takeEvery(USER_CHANGED, handler);
}
