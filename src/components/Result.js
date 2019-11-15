import React from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView, Text, StyleSheet, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';

const taxSummer = (total, item) => total + item.amount;

export const Result = ({
  params,
  grossAnnualIncome,
  deductions,
  backgroundImageUrl,
}) => {
  const formatNumber = number => {
    if (isNaN(number)) return '';
    return number.toLocaleString(params.country.locale, {
      maxSignificantDigits: 1,
    });
  };
  const formatCurrency = amount => {
    if (isNaN(amount)) return '';
    return amount.toLocaleString(params.country.locale, {
      style: 'currency',
      currency: params.country.currency,
    });
  };

  const daysWorkedPerYear = params.daysPerWeek * 52 - params.annualLeave;
  const totalDeductions = deductions.reduce(taxSummer, 0);
  const net = grossAnnualIncome - totalDeductions;
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
        <View style={styles.row}>
          <Text style={styles.label}>Hours per day</Text>
          <Text style={styles.label}>{formatNumber(params.hoursPerDay)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Days per week</Text>
          <Text style={styles.label}>{formatNumber(params.daysPerWeek)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Leave</Text>
          <Text style={styles.label}>{formatNumber(params.annualLeave)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Days worked in year</Text>
          <Text style={styles.label}>{formatNumber(daysWorkedPerYear)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hours worked in year</Text>
          <Text style={styles.label}>{formatNumber(hoursWorkedPerYear)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Income</Text>
          <Text style={styles.label}>{formatCurrency(grossAnnualIncome)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Income after deductions</Text>
          <Text style={styles.label}>{formatCurrency(net)}</Text>
        </View>
        {deductions.map(tax => (
          <View style={styles.row} key={tax.title}>
            <Text style={styles.label}>{tax.title}</Text>
            <Text style={styles.label}>{formatCurrency(tax.amount)}</Text>
          </View>
        ))}
        {/* <View style={styles.row}>
        <Text style={styles.label}>Student Loan</Text>
        <Text style={styles.label}>{formatCurrency(studentLoan)}</Text>
      </View> */}
        <View style={styles.row}>
          <Text style={styles.label}>Total deductions</Text>
          <Text style={styles.label}>{formatCurrency(totalDeductions)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hourly rate before deductions</Text>
          <Text style={styles.label}>
            {formatCurrency(hourlyRateBeforeTax)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hourly rate after deductions</Text>
          <Text style={styles.label}>{formatCurrency(hourlyRateAfterTax)}</Text>
        </View>
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
});
