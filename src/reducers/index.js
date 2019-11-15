import {combineReducers} from 'redux';
import calculation from './calculation';
import taxData from './taxData';
import wallpaper from './wallpaper';

export default combineReducers({
  calculation,
  taxData,
  wallpaper,
});
