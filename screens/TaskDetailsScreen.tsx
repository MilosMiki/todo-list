import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Task = {
  name: string;
  description: string;
  category: string;
  dueDate: Date;
  reminderDate: Date;
};

type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: { setTasks: React.Dispatch<React.SetStateAction<Task[]>> };
};

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const TaskDetailsScreen: React.FC<Props> = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name:</Text>
      <Text style={styles.value}>{task.name}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{task.description}</Text>

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{task.category}</Text>

      <Text style={styles.label}>Due Date:</Text>
      <Text style={styles.value}>{task.dueDate.toLocaleDateString()}</Text>

      <Text style={styles.label}>Reminder Date:</Text>
      <Text style={styles.value}>{task.reminderDate.toLocaleDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, marginBottom: 10 }
});

export default TaskDetailsScreen;