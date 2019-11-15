import {put, take} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import {
  TAX_DATA_LOAD_REQUEST,
  TAX_DATA_LOAD_SUCCESS,
} from '../actionTypes/taxData';
import {createAction} from '../actions';
import {Alerter} from '../components/Alerter';
import firestore from '@react-native-firebase/firestore';

export default function*() {
  const ch = eventChannel(emit => {
    const unsubscribe = firestore()
      .collection('tax')
      .onSnapshot({
        next: cSnap => {
          const d = cSnap.docs.map(dSnap => dSnap.data());
          emit(d);
        },
        onError: error => {
          console.log(error);
          Alerter.error(
            'Error featching tax data from the database',
            error.toString(),
          );
        },
      });

    return unsubscribe;
  });

  while (true) {
    const data = yield take(ch);
    yield put(createAction(TAX_DATA_LOAD_SUCCESS, data));
  }
}
