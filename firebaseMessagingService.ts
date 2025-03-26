import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background:', remoteMessage);
});

// Register the service worker
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => async (message) => {
  console.log('Background notification received:', message);
  return Promise.resolve();
});
