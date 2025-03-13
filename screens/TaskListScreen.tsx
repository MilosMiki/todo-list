import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
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

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { task: item })} style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name} - {item.dueDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask', { setTasks })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  taskItem: { padding: 15, borderBottomWidth: 1 },
  taskText: { fontSize: 16 }
});


export default TaskListScreen;