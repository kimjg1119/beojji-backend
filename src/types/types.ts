import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    // Add other properties that might be in the user object
  };
}

export interface UserData {
  name: string;
  email: string;
  studentId: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  studentId: string;
  role: string;
}