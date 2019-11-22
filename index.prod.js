/**
 * @format
 */
import './config';

import {AppRegistry, YellowBox} from 'react-native';
import App from './src/components/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings([
  'componentWillReceiveProps has been renamed',
  'componentWillUpdate has been renamed',
]);
