import React, {useState} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Terms} from '../actions';
import {Dropdown} from 'react-native-material-dropdown';
import {RaisedTextButton} from 'react-native-material-buttons';
import {TextField} from 'react-native-material-textfield';
import {Alerter} from './Alerter';
import Modal from 'react-native-modal';

const terms = [
  {label: 'Yearly', value: Terms.YEARLY, title: 'Annual salary'},
  {label: 'Daily', value: Terms.DAILY, title: 'Daily rate'},
  {label: 'Hourly', value: Terms.HOURLY, title: 'Hourly rate'},
];

const termsTitles = {
  [Terms.YEARLY]: 'Annual salary',
  [Terms.DAILY]: 'Daily rate',
  [Terms.HOURLY]: 'Hourly rate',
};

export default function IncomeForm({onSubmit, taxData}) {
  const [term, setTerm] = useState(Terms.YEARLY);
  const [rate, setRate] = useState('35000');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [annualLeave, setAnnualLeave] = useState('25');
  const [countrySelectorVisible, setCountrySelectorVisible] = useState(false);
  const [country, setCountry] = useState(taxData[0]);
  const [variant, setVariant] = useState(country.years[0]);

  const onPress = () => {
    var r = parseFloat(rate);
    if (isNaN(r)) {
      Alerter.error(termsTitles[Terms.YEARLY], 'Please enter a valid number');
      return;
    }
    var h = parseFloat(hoursPerDay);
    if (isNaN(h) || h <= 0 || h > 24) {
      Alerter.error('Hours per day', 'Please enter a valid number');
      return;
    }
    var d = parseFloat(daysPerWeek);
    if (isNaN(d) || d <= 0 || d > 7) {
      Alerter.error('Days per week', 'Please enter a valid number');
      return;
    }
    var l = parseFloat(annualLeave);
    if (isNaN(l) || l < 0 || l > 365) {
      Alerter.error('Holidays', 'Please enter a valid number');
      return;
    }

    onSubmit({
      country,
      variant,
      term,
      rate: r,
      hoursPerDay: h,
      daysPerWeek: d,
      annualLeave: l,
      repayStudentLoan: false,
    });
  };

  const renderCountries = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        setCountry(item);
        setVariant(item.years[0]);
        setCountrySelectorVisible(false);
      }}>
      <Text style={styles.flag}>{item.flag}</Text>
    </TouchableOpacity>
  );

  const extractCountryKey = item => item.flag;

  const renderVariantItem = item => (
    <TouchableOpacity
      key={item.title}
      style={styles.variantRow}
      onPress={() => setVariant(item)}>
      <Text>{item.title}</Text>
      {variant === item && <Text style={styles.tick}>✔️</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        onBackdropPress={() => setCountrySelectorVisible(false)}
        isVisible={countrySelectorVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Select a country</Text>
          <FlatList
            numColumns="3"
            data={taxData}
            renderItem={renderCountries}
            keyExtractor={extractCountryKey}
          />
        </View>
      </Modal>
      <Text style={styles.title}>Income Tax Calulatorc by Huy</Text>
      <View style={styles.countrySelectorButton}>
        <TouchableOpacity
          onPress={() => setCountrySelectorVisible(!countrySelectorVisible)}>
          <Text style={styles.flag}>{country.flag}</Text>
        </TouchableOpacity>
      </View>
      <View>{country.years.map(item => renderVariantItem(item))}</View>
      <View style={styles.termSelector}>
        <Dropdown
          label="My wage is calcualted"
          data={terms}
          value={term}
          onChangeText={value => setTerm(value)}
        />
      </View>
      <View style={styles.row}>
        <TextField
          label={term === Terms.YEARLY ? 'Salary' : 'Rate'}
          keyboardType="decimal-pad"
          tintColor={'#00BCD4'}
          placeholder="e.g. 43000"
          value={rate}
          onChangeText={setRate}
        />
      </View>
      <View>
        <TextField
          label="Hours per day"
          keyboardType="decimal-pad"
          tintColor={'#00BCD4'}
          placeholder="e.g. 7.5"
          value={hoursPerDay}
          suffix="hours"
          onChangeText={setHoursPerDay}
        />
      </View>
      <View>
        <TextField
          label="Days per week"
          keyboardType="decimal-pad"
          tintColor={'#00BCD4'}
          placeholder="e.g. 3.5"
          value={daysPerWeek}
          suffix="days"
          onChangeText={setDaysPerWeek}
        />
      </View>
      <View>
        <TextField
          label="Holidays"
          keyboardType="decimal-pad"
          tintColor={'#00BCD4'}
          placeholder="e.g. 26.5"
          style={styles.input}
          value={annualLeave}
          suffix="days"
          onChangeText={setAnnualLeave}
        />
      </View>
      <View>
        <RaisedTextButton
          style={styles.submitButton}
          title="Calculate"
          color={'#FF9800'}
          onPress={onPress}
        />
      </View>
    </View>
  );
}

IncomeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 60,
    paddingBottom: 60,
  },
  paddingTop: 60,
  title: {
    fontSize: 22,
    textAlign: 'center',
    paddingBottom: 10,
  },
  countrySelectorButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  variantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  termSelector: {
    marginTop: 20,
  },
  modal: {
    marginBottom: 250,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
  },
  flag: {
    fontSize: 64,
    width: 100,
    textAlign: 'center',
  },
  tick: {
    fontSize: 18,
  },
  submitButton: {
    marginTop: 30,
  },
});
