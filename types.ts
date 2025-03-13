export type Task = {
  name: string;
  description: string;
  category: string;
  dueDate: Date;
  reminderDate: Date;
};
export type RootStackParamList = {
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: { setTasks: React.Dispatch<React.SetStateAction<Task[]>> };
};