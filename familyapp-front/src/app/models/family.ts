import {Profile} from '../models/profile';

export interface Family {
  id: number;
  family_name: string;
  family_members: Profile[];
}
