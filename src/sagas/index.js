import {fork, spawn, all} from 'redux-saga/effects';

// sagas
import handleUseChange from './auth.saga';
import handleWatchDb from './watchDb.saga';
import handleSaveToDb from './saveToDb.saga';
import handleCalculateRequest from './calculateRequest.saga';
import handleWallpaperLoadRequest from './wallpaper.saga';

function* rootSagas() {
  yield all([
    fork(handleUseChange),
    fork(handleWatchDb),
    fork(handleSaveToDb),
    fork(handleCalculateRequest),
    fork(handleWallpaperLoadRequest),
  ]);
}

export default rootSagas;
