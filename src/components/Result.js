import React from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView, Text, StyleSheet, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';

const sepThou = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const sepNum = (number, precision = 0) => {
  const int = number | 0; // eslint-disable-line no-bitwise
  if (precision === 0) {
    return {int: sepThou(int), float: ''};
  }
  const float = ((number - int) * Math.pow(10, precision)) | 0; // eslint-disable-line no-bitwise
  return {
    int: sepThou(int),
    float: '.' + ('0' + float).substr(-precision),
  };
};

export const Result = ({
  params,
  grossAnnualIncome,
  deductions,
  backgroundImageUrl,
}) => {
  const daysWorkedPerYear = params.daysPerWeek * 52 - params.annualLeave;
  let totalDeductions = 9;
  const taxes = {};
  for (const k in deductions) {
    const d = deductions[k];
    totalDeductions += d;
    taxes[k] = sepNum(d, params.country.precision);
  }
  const net = grossAnnualIncome - totalDeductions;
  const dailyRateBeforeTax = grossAnnualIncome / daysWorkedPerYear;
  const dailyRateAfterTax = net / daysWorkedPerYear;
  const hoursWorkedPerYear = daysWorkedPerYear * params.hoursPerDay;
  const hourlyRateBeforeTax = grossAnnualIncome / hoursWorkedPerYear;
  const hourlyRateAfterTax = net / hoursWorkedPerYear;

  let backgroundImageOpacity = new Animated.Value(0);
  const fadeIn = () =>
    Animated.timing(backgroundImageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

  const numbers = {
    'Hours per day': sepNum(params.hoursPerDay, 1),
    'Days per week': sepNum(params.daysPerWeek, 1),
    'Annual leave': sepNum(params.annualLeave, 1),
    'Annual working days': sepNum(daysWorkedPerYear, 1),
    'Annual working hours': sepNum(hoursWorkedPerYear, 1),
  };

  const monies = {
    'Gross annual income': sepNum(grossAnnualIncome, params.country.precision),
    'Real annual income': sepNum(net, params.country.precision),
    'Daily rate': sepNum(dailyRateBeforeTax, params.country.precision),
    'Real daily rate': sepNum(dailyRateAfterTax, params.country.precision),
    'Hourly rate': sepNum(hourlyRateBeforeTax, params.country.precision),
    'Real hourly rate': sepNum(hourlyRateAfterTax, params.country.precision),
    Deductions: sepNum(totalDeductions, params.country.precision),
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <Animated.View
        style={[
          {opacity: backgroundImageOpacity},
          styles.backgroundImageHolder,
        ]}>
        <FastImage
          style={styles.backgroundImage}
          onLoad={fadeIn}
          source={{
            uri: backgroundImageUrl,
          }}
        />
      </Animated.View>
      <View style={styles.content}>
        <View style={styles.flagContainer}>
          <Text style={styles.flag}>{params.country.flag}</Text>
        </View>
        <View style={styles.titleHolder}>
          <Text style={styles.title}>{params.country.title}</Text>
        </View>
        <View style={styles.titleHolder}>
          <Text style={styles.subtitle}>{params.variant.title}</Text>
        </View>
        {Object.keys(numbers).map(label => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.label}>
              {numbers[label].int}
              <Text style={styles.float}>{numbers[label].float}</Text>
            </Text>
          </View>
        ))}
        {Object.keys(monies).map(label => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.label}>
              <Text style={styles.currency}>{params.country.prefix || ''}</Text>
              {monies[label].int}
              <Text style={styles.float}>{monies[label].float}</Text>
              <Text style={styles.currency}>{params.country.suffix || ''}</Text>
            </Text>
          </View>
        ))}
        {Object.keys(taxes).map(label => (
          <View style={styles.row} key={label}>
            <Text style={styles.label}> - {label}</Text>
            <Text style={styles.label}>
              <Text style={styles.currency}>{params.country.prefix || ''}</Text>
              {taxes[label].int}
              <Text style={styles.float}>{taxes[label].float}</Text>
              <Text style={styles.currency}>{params.country.suffix || ''}</Text>
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

Result.propType = {
  gross: PropTypes.number.isRequired,
  studentLoan: PropTypes.number,
  taxes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 60,
  },
  backgroundImageHolder: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingTop: 3,
    paddingBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    marginTop: 5,
    borderRadius: 6,
  },
  label: {
    fontSize: 18,
  },
  flagContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 128,
    width: 128,
    textAlign: 'center',
  },
  titleHolder: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 25,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  float: {
    color: '#666',
  },
  currency: {
    color: '#666',
  },
});
