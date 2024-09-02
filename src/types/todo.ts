export type TodoList = ToDo[];

export type ToDo = {
  id: string;
  todo_title: string;
  todo_status: boolean;
  created_at: Date;
  completed_at: Date;
};
