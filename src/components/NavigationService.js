import {NavigationActions} from 'react-navigation';

let _navigator;

export function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

export function setParams({params, key}) {
  _navigator.dispatch(NavigationActions.setParams({params, key}));
}
