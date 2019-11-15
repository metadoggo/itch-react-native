import {combineReducers} from 'redux';
import auth from './auth';
import calculation from './calculation';
import wallpaper from './wallpaper';

export default combineReducers({
  auth,
  calculation,
  wallpaper,
});
