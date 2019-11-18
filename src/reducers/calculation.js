import {MOVE_RESULT_TO_TOP, RESULT_LOADED} from '../actionTypes/calculation';

export default function(state = [], action) {
  switch (action.type) {
    case RESULT_LOADED:
      return [action.data, ...state];
    case MOVE_RESULT_TO_TOP:
      var els = state.slice();
      els.splice(action.data, 1);
      els.unshift(state[action.data]);
      return els;
    default:
      return state;
  }
}
