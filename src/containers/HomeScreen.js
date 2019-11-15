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
import names from './names';
import {CALCULATE_REQUEST} from '../actionTypes/calculation';
import {createAction} from '../actions';
import {connect} from 'react-redux';
import taxData from '../../data/tax-data.json';

function FormScreen({componentId}) {
  const dispatch = useDispatch();

  const onSubmit = formData => {
    dispatch(createAction(CALCULATE_REQUEST, formData));
    // Navigation.push(componentId, {
    //   component: {
    //     name: names.ResultScreen,
    //   },
    // });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          style={styles.scrollView}
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
          {/* <IncomeForm taxData={taxData} onSubmit={onSubmit} /> */}
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
    paddingBottom: 50,
  },
});

const mapStateToProps = state => ({taxData: state.taxData});

export default connect(mapStateToProps)(FormScreen);
