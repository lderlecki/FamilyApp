import {Family} from './family';
import {Profile} from './profile';

export interface Invitation {
  id: number;
  date: Date;
  family: Family;
  profile: Profile;
}
