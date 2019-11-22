import {MOVE_RESULT_TO_TOP, RESULT_LOADED} from '../actionTypes/calculation';

const sepThou = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const sepNum = (number, precision = 0) => {
  const int = number | 0; // eslint-disable-line no-bitwise
  if (precision === 0) {
    return {int: sepThou(int), float: ''};
  }
  const float = Math.round((number - int) * Math.pow(10, precision));
  return {
    int: sepThou(int),
    float: '.' + ('0' + float).substr(-precision),
  };
};

function prepSection(data, precision) {
  const taxes = {};
  for (const k in data.taxes) {
    taxes[k] = sepNum(data.taxes[k], precision);
  }
  let leave = '';
  if (data.leave.days) {
    leave += data.leave.days + ' days';
  }
  if (data.leave.hours) {
    if (leave) {
      leave += ', ';
    }
    leave += data.leave.hours + ' hours';
  }
  if (data.leave.minutes) {
    if (leave) {
      leave += ', ';
    }
    leave += data.leave.minutes + ' minutes';
  }

  const o = {
    gross: sepNum(data.gross, precision),
    net: sepNum(data.net, precision),
    leave,
    taxes,
    taxed: sepNum(data.taxed, precision),
  };

  if (data.hours) {
    o.hours = sepNum(data.hours, 1);
  }
  if (data.days) {
    o.days = sepNum(data.days, 1);
  }
  if (data.weeks) {
    o.weeks = sepNum(data.weeks, 1);
  }
  if (data.months) {
    o.months = sepNum(data.months, 1);
  }
  return o;
}

export default function(state = [], action) {
  switch (action.type) {
    case RESULT_LOADED:
      return action.data.map(result => ({
        docRef: result.ref,
        id: result.id,
        params: {
          rate: sepNum(result.params.rate),
          term: result.params.term,
          hoursPerDay: result.params.hoursPerDay,
          daysPerWeek: result.params.daysPerWeek,
          annualLeave: result.params.annualLeave,
        },
        country: result.country,
        variant: result.variant,
        durations: {
          y: prepSection(result.year, result.country.precision),
          m: prepSection(result.month, result.country.precision),
          w: prepSection(result.week, result.country.precision),
          d: prepSection(result.day, result.country.precision),
          h: prepSection(result.hour, result.country.precision),
        },
      }));
    case MOVE_RESULT_TO_TOP:
      var els = state.slice();
      els.splice(action.data, 1);
      els.unshift(state[action.data]);
      return els;
    default:
      return state;
  }
}
