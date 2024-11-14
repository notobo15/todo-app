export interface Todo {
  id: string;
  todo: string;
  createdDate: string;
  isCompleted: boolean;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdDate: string;
}
