import {Profile} from '../models/profile';

export interface Family {
  id: number;
  familyName: string;
  familyMembers: Profile[];
}
