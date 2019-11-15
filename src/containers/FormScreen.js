import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {useDispatch} from 'react-redux';
import IncomeForm from '../components/IncomeForm';
import DropdownAlert from 'react-native-dropdownalert';
import {Alerter} from '../components/Alerter';
import {CALCULATE_REQUEST} from '../actionTypes/calculation';
import {createAction} from '../actions';
import taxData from '../../data/tax-data.json';

export default function FormScreen({navigation}) {
  const dispatch = useDispatch();

  const onSubmit = formData => {
    dispatch(createAction(CALCULATE_REQUEST, formData));
    navigation.navigate('Result');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled">
          <View style={styles.head}>
            <Text style={styles.headline}>Huy's Income Calculator</Text>
          </View>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <IncomeForm taxData={taxData} onSubmit={onSubmit} />
          <View style={styles.scrollView} />
        </ScrollView>
      </SafeAreaView>
      <DropdownAlert ref={ref => Alerter.setDialog(ref)} closeInterval={3000} />
    </>
  );
}

const styles = StyleSheet.create({
  head: {
    height: 150,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  headline: {
    fontSize: 32,
    textAlign: 'center',
  },
  scrollView: {
    paddingBottom: 100,
  },
});
