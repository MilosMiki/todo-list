export type Task = {
  name: string;
  description: string;
  category: string;
  dueDate: Date;
  reminderDate: Date;
  created_by: string;
};
export type RootStackParamList = {
  Login: undefined;
  TaskList: undefined;
  TaskDetails: { task: Task };
  AddTask: { setTasks: React.Dispatch<React.SetStateAction<Task[]>> };
};

export type TabParamList = {
  Login: undefined;
  TaskListTab: undefined;
  Settings: undefined;
};