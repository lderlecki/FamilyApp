import {Profile} from '../model/profile';

export interface Family {
  id: number;
  familyName: string;
  familyMembers: Profile[];
}
