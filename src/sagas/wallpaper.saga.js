import {put, takeEvery, select} from 'redux-saga/effects';
import Config from 'react-native-config';

import {
  WALLPAPER_LOAD_REQUEST,
  WALLPAPER_LOAD_SUCCESS,
} from '../actionTypes/wallpaper';
import {createAction} from '../actions';

function* handler(action) {
  const wallpaper = yield select(state => state.wallpaper);
  if (!wallpaper.hasOwnProperty(action.data)) {
    const data = yield fetch('https://api.unsplash.com/photos/random', {
      headers: {
        Authorization: 'Client-ID ' + Config.UNSPLASH_PUB_KEY,
        'Accept-Version': 'v1',
      },
    })
      .then(res => res.json())
      .catch(error => {
        console.log(error);
      });
    if (data && data.errors) {
      console.log(data.errors);
      return;
    }
    yield put(
      createAction(WALLPAPER_LOAD_SUCCESS, {key: action.data, data: data}),
    );
  }
}

export default function*() {
  yield takeEvery(WALLPAPER_LOAD_REQUEST, handler);
}
