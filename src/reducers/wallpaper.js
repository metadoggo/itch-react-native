import {
  WALLPAPER_LOAD_SUCCESS,
  WALLPAPER_LOAD_STARTED,
  WALLPAPER_LOAD_FAILURE,
} from '../actionTypes/wallpaper';
import {LOADING, LOADED, FAILED} from '../constants/loading.states';

export default function(state = {}, action) {
  switch (action.type) {
    case WALLPAPER_LOAD_STARTED:
      return {...state, [action.data.id]: {state: LOADING}};
    case WALLPAPER_LOAD_FAILURE:
      return {...state, [action.data.id]: {state: FAILED}};
    case WALLPAPER_LOAD_SUCCESS:
      // Dont merge if the image already exists (avoid dups)
      for (const k in state) {
        const meta = state[k];
        if (meta.state === LOADED && meta.data.id === action.data.data.id) {
          return state;
        }
      }
      return {
        ...state,
        [action.data.id]: {state: LOADED, data: action.data.data},
      };
    default:
      return state;
  }
}
