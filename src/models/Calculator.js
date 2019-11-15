import {Terms} from '../actions';

const WEEKS_PER_YEAR = 52;

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

export const getGrossAnnualIncome = ({
  term,
  rate,
  hoursPerDay,
  daysPerWeek,
  annualLeave,
}) => {
  var workingDaysPerYear = daysPerWeek * 52 - annualLeave;
  var workingHoursPerYear = workingDaysPerYear * hoursPerDay;

  switch (term) {
    case Terms.HOURLY:
      return rate * workingHoursPerYear;
    case Terms.DAILY:
      return rate * workingDaysPerYear;
    case Terms.WEEKLY:
      return rate * 52;
    case Terms.MONTHLY:
      return rate * 12;
    default:
      return rate;
  }
};

const normailizeBands = (bands, multiplier) =>
  bands.map(band => ({rate: band.rate, limit: band.limit * multiplier}));

export const getDeductions = (taxData, annualIncome) => {
  // const studentLoan = repayStudentLoan ? getStudentLoan(gross) : 0;

  const deductions = [];
  for (let i = 0; i < taxData.categories.length; i++) {
    const cat = taxData.categories[i];
    let bands;
    switch (cat.schedule) {
      case 'weekly':
        bands = normailizeBands(cat.bands, 52);
        break;
      case 'monthly':
        bands = normailizeBands(cat.bands, 12);
        break;
      default:
        bands = cat.bands;
    }
    deductions.push({
      title: cat.title,
      amount: getIncomeTax(bands, annualIncome),
    });
  }
  return deductions;
};
