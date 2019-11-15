import {
  CALCULATE_REQUEST,
  CALCULATE_SUCCESS,
} from '../actionTypes/calculation';

export const Terms = {
  YEARLY: 'Yearly',
  MONTHLY: 'Monthly',
  WEEKLY: 'Weekly',
  DAILY: 'Daily',
  HOURLY: 'Hourly',
};

export const createAction = (id, data) => ({
  type: id,
  data: data,
});