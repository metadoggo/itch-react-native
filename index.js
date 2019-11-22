/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './src/components/App';
import {name as appName} from './app.json';
import Config from 'react-native-config';
console.info(Config);

AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings([
  'componentWillReceiveProps has been renamed',
  'componentWillUpdate has been renamed',
]);
