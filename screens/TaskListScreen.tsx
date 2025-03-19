import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';

type Task = {
  id: string;
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
  
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }
    const unsubscribe = firestore()
      .collection('tasks')
      .where('created_by', '==', user.email) 
      .onSnapshot((querySnapshot) => {
        const taskList: Task[] = [];
        querySnapshot.forEach((documentSnapshot) => {
          const taskData = documentSnapshot.data();
  
          if (taskData.dueDate && taskData.dueDate.toDate) {
            taskData.dueDate = taskData.dueDate.toDate();
          }
          if (taskData.reminderDate && taskData.reminderDate.toDate) {
            taskData.reminderDate = taskData.reminderDate.toDate();
          }
          const taskData2 = taskData as Task;
          taskList.push({ ...taskData2, id: documentSnapshot.id });
        });
        setTasks(taskList);
      });
  
    return () => unsubscribe();
  }, []);

  const deleteTask = async (taskId: string) => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const renderSwipeableItem = (task: Task) => {
    //console.log(task.id);
    return (
      <Swipeable
        renderRightActions={() => (
          <RectButton
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Task',
                'Are you sure you want to delete this task?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteTask(task.id), // Delete the task
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </RectButton>
        )}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('TaskDetails', { task })}
          style={styles.taskItem}
        >
          <Text style={styles.taskText}>
            {task.name} - {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderSwipeableItem(item)}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask', { setTasks })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  taskItem: { padding: 15, borderBottomWidth: 1 },
  taskText: { fontSize: 16 },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default TaskListScreen;