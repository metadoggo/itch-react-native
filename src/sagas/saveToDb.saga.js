import {takeEvery, select} from 'redux-saga/effects';
import {CALCULATE_SUCCESS} from '../actionTypes/calculation';
import firestore from '@react-native-firebase/firestore';

function* handler(action) {
  const user = yield select(state => state.auth);
  const userId = (user && user.uid) || '';
  const data = action.data;
  const params = data.params;
  const country = params.country;
  const variant = params.variant;
  const now = Date.now();
  yield firestore()
    .collection('results')
    .add({
      userId,
      createdAt: now,
      flag: country.flag,
      country: country.title,
      currency: country.currency,
      annualGross: data.grossAnnualIncome,
      deductions: data.deductions,
      variant: variant.title,
      term: params.term,
      rate: params.rate,
      hoursPerDay: params.hoursPerDay,
      daysPerWeek: params.daysPerWeek,
      annualLeave: params.annualLeave,
      deleted: false,
    });
}

export default function*() {
  yield takeEvery(CALCULATE_SUCCESS, handler);
}
