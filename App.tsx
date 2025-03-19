/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskListScreen from './screens/TaskListScreen';
import TaskDetailsScreen from './screens/TaskDetailsScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import LoginScreen from './screens/LoginScreen';
import type { RootStackParamList } from './types';
//import './firebaseConfig';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
