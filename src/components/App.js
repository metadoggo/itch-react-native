/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSagas from '../sagas';

import FormScreen from '../containers/FormScreen';
import ResultScreen from '../containers/ResultScreen';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSagas);

const RootStack = createStackNavigator(
  {
    Form: FormScreen,
    Result: ResultScreen,
  },
  {
    initialRouteName: 'Form',
  },
);
const AppContainer = createAppContainer(RootStack);

export default () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);
