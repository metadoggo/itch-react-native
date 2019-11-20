import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';
import IncomeForm from '../components/IncomeForm';
import DropdownAlert from 'react-native-dropdownalert';
import {Alerter} from '../components/Alerter';
import {CALCULATE_REQUEST} from '../actionTypes/calculation';
import {createAction} from '../actions';
import taxData from '../../data/tax-data.json';
import Icon from 'react-native-vector-icons/dist/Feather';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function FormScreen({navigation}) {
  const dispatch = useDispatch();

  const onSubmit = formData => {
    dispatch(createAction(CALCULATE_REQUEST, formData));
    navigation.navigate('Result', {index: 0});
  };

  const handleDynamicLink = link => {
    const queryString = link.url.split('?')[1];
    const params = queryString.split('&');
    let i = params.length;
    const m = {};
    while (i--) {
      const p = params[i].split('=');
      m[p[0]] = p[1];
    }
    const formData = {
      term: m.t,
      rate: parseFloat(m.r),
      hoursPerDay: parseFloat(m.h),
      daysPerWeek: parseFloat(m.d),
      annualLeave: parseFloat(m.l),
    };
    dispatch(createAction(CALCULATE_REQUEST, formData));
    navigation.navigate('Result', {index: 0});
  };

  useEffect(() => dynamicLinks().onLink(handleDynamicLink), []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled">
          <IncomeForm taxData={taxData} onSubmit={onSubmit} />
        </ScrollView>
      </SafeAreaView>
      <DropdownAlert ref={ref => Alerter.setDialog(ref)} closeInterval={3000} />
    </>
  );
}

FormScreen.navigationOptions = {
  title: 'Income Tax Calculator by Huy',
  tabBarLabel: 'Calculator',
  tabBarIcon: <Icon name="edit-3" size={28} color="#fff" />,
  tabBarColor: '#03A9F4',
  shifting: true,
};
