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
    country,
    variant,
    term,
    rate,
    hoursPerDay,
    daysPerWeek,
    annualLeave,
  } = action.data;
  const id = md5(
    country.flag +
      variant.title +
      term +
      rate.toFixed(country.precision) +
      hoursPerDay.toFixed(country.precision) +
      daysPerWeek.toFixed(country.precision) +
      annualLeave.toFixed(country.precision),
  );

  const i = results.findIndex(el => el.id === id);
  if (i === -1) {
    const result = calculate(
      variant.categories,
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
          id: country.id,
          name: country.title,
          flag: country.flag,
          locale: country.locale,
          currency: country.currency,
          prefix: country.prefix,
          suffix: country.suffix,
          country: country.precision,
        },
        variant: variant.title,
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
