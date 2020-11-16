import {Family} from './family';

export class Profile {
    id: number;
    user: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    family?: Family;
    jwtToken?: string;
}
