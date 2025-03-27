/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './firebaseMessagingService';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Notifications will appear in system tray automatically
  console.log('Background notification:', remoteMessage);
  return Promise.resolve(); // Important for Android (ne radi bez ovoga)
});

AppRegistry.registerComponent(appName, () => App);
