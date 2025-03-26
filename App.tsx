/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskListScreen from './screens/TaskListScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import type { RootStackParamList, TabParamList } from './types';
//import './firebaseConfig';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

export const categories = ['Work', 'School', 'Personal', 'Shopping'];

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted.');
    getFCMToken();
  } else {
    Alert.alert('Notification permission denied');
  }
};

const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('Background notification:', remoteMessage);
  } catch (error) {
    console.error('Background handler error:', error);
  }
});

messaging().onMessage(async remoteMessage => {
  try {
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  } catch (error) {
    console.error('Foreground handler error:', error);
  }
});

// Bottom Tabs Navigator
const TabsNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 16,
        position: 'absolute',
        top: 14,
      },
      tabBarStyle: { height: 50 },
    }}
  >
    <Tab.Screen
      name="TaskListTab"
      component={TaskListScreen}
      options={{
        title: 'Tasks',
        tabBarIcon: () => null,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        tabBarIcon: () => null,
      }}
    />
  </Tab.Navigator>
);


export default function App() {
  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('New Notification', remoteMessage.notification?.body || 'No message body');
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="TaskList" component={TabsNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}