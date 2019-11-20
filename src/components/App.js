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
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSagas from '../sagas';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

import FormScreen from '../containers/FormScreen';
import ResultScreen from '../containers/ResultScreen';
import navigationDebouncer from 'react-navigation-redux-debouncer';
import {setTopLevelNavigator} from './NavigationService';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware, navigationDebouncer(600)),
);
sagaMiddleware.run(rootSagas);

const RootStack = createMaterialBottomTabNavigator(
  {
    Form: FormScreen,
    Result: ResultScreen,
  },
  {
    initialRouteName: 'Form',
    backBehavior: 'initialRoute',
    order: ['Form', 'Result'],
    activeColor: 'black',
    labeled: false,
  },
);

const AppContainer = createAppContainer(RootStack);

export default () => (
  <Provider store={store}>
    <AppContainer
      ref={navigatorRef => {
        setTopLevelNavigator(navigatorRef);
      }}
    />
  </Provider>
);
