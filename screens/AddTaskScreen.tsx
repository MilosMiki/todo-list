import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { categories } from '../App';
import type { RootStackParamList } from '../types';

type Task = {
  name: string;
  description: string;
  category: string;
  dueDate: Date;
  reminderDate: Date;
  created_by: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const AddTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { setTasks } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDuePicker, setShowDuePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [nameError, setNameError] = useState('');
  const [dueDateWarning, setDueDateWarning] = useState('');

  const handleReminderDateChange = (date: Date) => {
    setReminderDate(date);
    if (date > dueDate) {
      setDueDate(date);
      setDueDateWarning('Due date updated to match reminder date.');
    }
  };

  const addTask = async () => {
    if (name.trim() === '') {
      setNameError('Task name cannot be empty.');
      return;
    }
    setNameError('');
    setDueDateWarning('');

    const user = auth().currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const task = {
      name,
      description,
      category,
      dueDate,
      reminderDate,
      created_by: user.email,
    };

    await firestore().collection('tasks').add(task);

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Task Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <Text style={styles.label}>Description:</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

        <Text style={styles.label}>Category:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={[styles.picker, { color: 'black' }]}
          >
            {categories.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Due Date:</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDuePicker(true)}>
          <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDuePicker && (
          <DatePicker
            modal
            open={showDuePicker}
            date={dueDate}
            mode="date"
            onConfirm={(date) => {
              setShowDuePicker(false);
              setDueDate(date);
              setDueDateWarning('');
            }}
            onCancel={() => setShowDuePicker(false)}
          />
        )}
        {dueDateWarning ? <Text style={styles.warningText}>{dueDateWarning}</Text> : null}

        <Text style={styles.label}>Reminder Date:</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowReminderPicker(true)}>
          <Text style={styles.dateText}>{reminderDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showReminderPicker && (
          <DatePicker
            modal
            open={showReminderPicker}
            date={reminderDate}
            mode="date"
            onConfirm={(date) => {
              setShowReminderPicker(false);
              handleReminderDateChange(date);
            }}
            onCancel={() => setShowReminderPicker(false)}
          />
        )}

        <Button title="Add Task" onPress={addTask} />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingBottom: 20 },
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, backgroundColor: '#f9f9f9' },
  picker: { height: 50, width: '100%' },
  dateInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, backgroundColor: '#f9f9f9', marginBottom: 10 },
  dateText: { fontSize: 16, color: 'black' },
  errorText: { color: 'red', marginTop: 5, fontSize: 14 },
  warningText: { color: 'orange', marginTop: 10, fontSize: 14 }
});

export default AddTaskScreen;
