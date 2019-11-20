import {put, takeEvery, select} from 'redux-saga/effects';
import calculate from '../models/Calculator';
import {
  CALCULATE_REQUEST,
  CALCULATE_SUCCESS,
  MOVE_RESULT_TO_TOP,
} from '../actionTypes/calculation';
import {createAction} from '../actions';
import md5 from 'md5';

function* handler(action) {
  const results = yield select(state => state.calculation);
  const {
    country: {flag, title: name, locale, currency, prefix, suffix, precision},
    variant: {title: variant, categories: taxCategories},
    term,
    rate,
    hoursPerDay,
    daysPerWeek,
    annualLeave,
  } = action.data;
  const id = md5(
    flag +
      variant +
      term +
      rate.toFixed(precision) +
      hoursPerDay.toFixed(precision) +
      daysPerWeek.toFixed(precision) +
      annualLeave.toFixed(precision),
  );

  const i = results.findIndex(el => el.id === id);
  if (i === -1) {
    const result = calculate(
      taxCategories,
      term,
      rate,
      hoursPerDay,
      daysPerWeek,
      annualLeave,
    );
    yield put(
      createAction(CALCULATE_SUCCESS, {
        id,
        params: {
          term,
          rate,
          hoursPerDay,
          daysPerWeek,
          annualLeave,
        },
        country: {
          name,
          flag,
          locale,
          currency,
          prefix,
          suffix,
          precision,
        },
        variant,
        ...result,
      }),
    );
  } else if (i > 0) {
    yield put(createAction(MOVE_RESULT_TO_TOP, i));
  }
}

export default function*() {
  yield takeEvery(CALCULATE_REQUEST, handler);
}
