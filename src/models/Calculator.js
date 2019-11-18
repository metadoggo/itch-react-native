import {Terms} from '../actions';

const WEEKS_PER_YEAR = 52;
const MONTH_PER_YEAR = 52;

const getIncomeTax = (taxBands, grossIncome) => {
  var rem = 0;
  var tax = 0;

  for (var i = 0, j = taxBands.length; i < j; i++) {
    var band = taxBands[i];
    if (grossIncome >= band.limit && band.limit > 0) {
      tax += (band.limit - rem) * band.rate;
      if (band.rate === 0) {
        grossIncome -= band.limit;
      } else {
        rem = band.limit - rem;
        grossIncome -= rem;
      }
    } else {
      tax += grossIncome * band.rate;
      grossIncome = 0;
      break;
    }
  }
  return tax;
};

export function getGrossAnnualIncome(
  term,
  rate,
  hoursPerDay,
  daysPerWeek,
  annualLeave,
) {
  var workingDaysPerYear = daysPerWeek * WEEKS_PER_YEAR - annualLeave;
  var workingHoursPerYear = workingDaysPerYear * hoursPerDay;

  switch (term) {
    case Terms.HOURLY:
      return rate * workingHoursPerYear;
    case Terms.DAILY:
      return rate * workingDaysPerYear;
    case Terms.WEEKLY:
      return rate * WEEKS_PER_YEAR;
    case Terms.MONTHLY:
      return rate * MONTH_PER_YEAR;
    default:
      return rate;
  }
}

const normailizeBands = (bands, multiplier) =>
  bands.map(band => ({rate: band.rate, limit: band.limit * multiplier}));

export const getDeductions = (taxCategories, gross) => {
  // const studentLoan = repayStudentLoan ? getStudentLoan(gross) : 0;

  const taxes = {};
  let taxed = 0;
  for (let i = 0; i < taxCategories.length; i++) {
    const cat = taxCategories[i];
    let bands;
    switch (cat.schedule) {
      case 'weekly':
        bands = normailizeBands(cat.bands, WEEKS_PER_YEAR);
        break;
      case 'monthly':
        bands = normailizeBands(cat.bands, MONTH_PER_YEAR);
        break;
      default:
        bands = cat.bands;
    }
    const tax = getIncomeTax(bands, gross);
    taxes[cat.title] = tax;
    taxed += tax;
  }
  return {taxes, taxed};
};

export default function(taxCategories, term, rate, hours, days, leave) {
  const gross = getGrossAnnualIncome(term, rate, hours, days, leave);
  const {taxes: yearTaxes, taxed} = getDeductions(taxCategories, gross);
  const net = gross - taxed;

  const workingDaysPerYear = days * WEEKS_PER_YEAR - leave;
  const workingHoursPerYear = workingDaysPerYear * hours;

  const decadeTaxes = {};
  const monthTaxes = {};
  const weekTaxes = {};
  const dayTaxes = {};
  const hourTaxes = {};
  for (const k in yearTaxes) {
    decadeTaxes[k] = yearTaxes[k] * 10;
    monthTaxes[k] = yearTaxes[k] / 12;
    weekTaxes[k] = yearTaxes[k] / 52;
    dayTaxes[k] = yearTaxes[k] / workingDaysPerYear;
    hourTaxes[k] = yearTaxes[k] / workingHoursPerYear;
  }

  function daysToDuration(d) {
    const dd = d | 0; // eslint-disable-line no-bitwise
    const h = (d - dd) * hours;
    const hh = h | 0; // eslint-disable-line no-bitwise
    const m = (h - hh) * 60;
    const mm = m | 0; // eslint-disable-line no-bitwise
    return {days: dd, hours: hh, minutes: mm};
  }

  return {
    decade: {
      gross: gross * 10,
      net: net * 10,
      taxes: decadeTaxes,
      taxed: taxed * 10,
      leave: daysToDuration(leave * 10),
      hours: workingHoursPerYear * 10,
      days: workingDaysPerYear * 10,
      weeks: (workingDaysPerYear / 52) * 10,
      months: (workingDaysPerYear / 12) * 10,
    },
    year: {
      gross: gross,
      net: net,
      taxes: yearTaxes,
      taxed: taxed,
      leave: daysToDuration(leave),
      hours: workingHoursPerYear,
      days: workingDaysPerYear,
      weeks: workingDaysPerYear / 52,
      months: workingDaysPerYear / 12,
    },
    month: {
      gross: gross / 12,
      net: net / 12,
      taxes: monthTaxes,
      taxed: taxed / 12,
      leave: daysToDuration(leave / 12),
      hours: workingHoursPerYear / 12,
      weeks: workingDaysPerYear / 12,
    },
    week: {
      gross: gross / 52,
      net: net / 52,
      taxes: weekTaxes,
      taxed: taxed / 52,
      leave: daysToDuration(leave / 52),
      hours: workingHoursPerYear / 52,
      days: workingDaysPerYear / 52,
    },
    day: {
      gross: gross / workingDaysPerYear,
      net: net / workingDaysPerYear,
      taxes: dayTaxes,
      taxed: taxed / workingDaysPerYear,
      leave: daysToDuration(leave / workingDaysPerYear),
      hours: workingHoursPerYear / workingDaysPerYear,
    },
    hour: {
      gross: gross / workingHoursPerYear,
      net: net / workingHoursPerYear,
      taxes: hourTaxes,
      taxed: taxed / workingHoursPerYear,
      leave: daysToDuration(leave / workingHoursPerYear),
    },
  };
}
