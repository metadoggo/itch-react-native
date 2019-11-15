import {fork, spawn, all} from 'redux-saga/effects';

// sagas
// import fetchTaxData from './fetchTaxData.saga';
import handleCalculateRequest from './calculateRequest.saga';
import handleWallpaperLoadRequest from './wallpaper.saga';

function* rootSagas() {
  yield all([
    // fork(fetchTaxData),
    fork(handleCalculateRequest),
    fork(handleWallpaperLoadRequest),
  ]);
}

export default rootSagas;
