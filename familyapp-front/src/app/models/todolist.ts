import {Profile} from './profile';
import {Task} from './task';

export interface Todolist {
  id?: number;
  name: string;
  dueDate: Date;
  description: string;
  tasks: Task[];
}
