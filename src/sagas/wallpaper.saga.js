import {put, takeEvery as takeLatest, select} from 'redux-saga/effects';
import Config from 'react-native-config';

import {
  WALLPAPER_LOAD_REQUEST,
  WALLPAPER_LOAD_STARTED,
  WALLPAPER_LOAD_SUCCESS,
  WALLPAPER_LOAD_FAILURE,
} from '../actionTypes/wallpaper';
import {createAction} from '../actions';

function* handler(action) {
  const wallpaper = yield select(state => state.wallpaper);
  // If the state exists, assume that it is loading or loaded, dont start new fetch
  if (!wallpaper.hasOwnProperty(action.data)) {
    yield put(createAction(WALLPAPER_LOAD_STARTED, {id: action.data}));
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
      yield put(
        createAction(WALLPAPER_LOAD_FAILURE, {
          id: action.data,
          error: data.errors,
        }),
      );
      return;
    }
    yield put(
      createAction(WALLPAPER_LOAD_SUCCESS, {id: action.data, data: data}),
    );
  }
}

export default function*() {
  yield takeLatest(WALLPAPER_LOAD_REQUEST, handler);
}
