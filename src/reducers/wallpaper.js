import {WALLPAPER_LOAD_SUCCESS} from '../actionTypes/wallpaper';

export default function(state = {}, action) {
  switch (action.type) {
    case WALLPAPER_LOAD_SUCCESS:
      return {[action.data.id]: action.data.data, ...state};
    default:
      return state;
  }
}
