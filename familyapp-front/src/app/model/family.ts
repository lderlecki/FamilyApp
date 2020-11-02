import {Profile} from './profile';

export interface Family {
  id: number;
  familyName: string;
  familyMembers: Profile[];
}
