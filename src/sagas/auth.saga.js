import {put, take} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {USER_CHANGED} from '../actionTypes/auth';
import {createAction} from '../actions';
import auth from '@react-native-firebase/auth';

export default function*() {
  const ch = eventChannel(emit =>
    auth().onAuthStateChanged(async user => {
      console.log(user);
      if (user) {
        return emit(user);
      }
      try {
        await auth().signInAnonymously();
      } catch (e) {
        switch (e.code) {
          case 'auth/operation-not-allowed':
            console.log('Enable anonymous in your firebase console.');
            break;
          default:
            console.error(e);
            break;
        }
      }
    }),
  );

  while (true) {
    yield put(createAction(USER_CHANGED, yield take(ch)));
  }
}
