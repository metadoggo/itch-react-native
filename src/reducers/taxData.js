import {
    TAX_DATA_LOAD_SUCCESS} from '../actionTypes/taxData';

export default function (state = [], action) {
  switch (action.type) {
    case TAX_DATA_LOAD_SUCCESS:
        return action.data;
    default:
      return state;
  }
};