import {Profile} from './profile';

export interface Task {
  id: number;
  name: string;
  description: string;
  done: boolean;
  responsiblePerson: Profile;
}
