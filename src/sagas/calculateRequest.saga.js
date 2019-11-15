import {put, takeEvery, select} from 'redux-saga/effects';
import {getGrossAnnualIncome, getDeductions} from '../models/Calculator';
import {
  CALCULATE_REQUEST,
  CALCULATE_SUCCESS,
  MOVE_RESULT_TO_TOP,
} from '../actionTypes/calculation';
import {createAction} from '../actions';
import md5 from 'md5';

function* handler(action) {
  const calculation = yield select(state => state.calculation);
  const params = action.data;

  const i = calculation.findIndex(
    el =>
      el.params.country.currency === params.country.currency &&
      el.params.variant.title === params.variant.title &&
      el.params.term === params.term &&
      el.params.rate === params.rate &&
      el.params.hoursPerDay === params.hoursPerDay &&
      el.params.daysPerWeek === params.daysPerWeek &&
      el.params.annualLeave === params.annualLeave,
  );
  if (i === -1) {
    const key = md5(
      params.country.currency +
        params.variant.title +
        params.term +
        params.rate.toString() +
        params.hoursPerDay.toString() +
        params.daysPerWeek.toString() +
        params.annualLeave.toString(),
    );
    const grossAnnualIncome = getGrossAnnualIncome(params);
    const deductions = getDeductions(params.variant, grossAnnualIncome);
    yield put(
      createAction(CALCULATE_SUCCESS, {
        key,
        params,
        grossAnnualIncome,
        deductions,
      }),
    );
  } else if (i > 0) {
    yield put(createAction(MOVE_RESULT_TO_TOP, i));
  }
}

export default function*() {
  yield takeEvery(CALCULATE_REQUEST, handler);
}
