import {CALCULATE_SUCCESS, MOVE_RESULT_TO_TOP} from '../actionTypes/calculation';

export default function (state = [], action) {
  switch (action.type) {
    case CALCULATE_SUCCESS:
      return [action.data, ...state];
    case MOVE_RESULT_TO_TOP:
      var els = state.slice();
      els.splice(action.data, 1);
      els.unshift(state[action.data]);
      return els;
    default:
      return state;
  }
};