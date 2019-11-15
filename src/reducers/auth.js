import {USER_CHANGED} from '../actionTypes/auth';

export default function(state = {}, action) {
  switch (action.type) {
    case USER_CHANGED:
      return action.data;
    default:
      return state;
  }
}
