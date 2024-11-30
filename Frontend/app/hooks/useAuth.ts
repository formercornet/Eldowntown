import { useContext } from 'react';
import { AuthContext } from '../providers/auth';

export interface User {
  username: string;
  name?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (user: User) => void;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => void;
}

export interface SignUpData {
  name: string;
  email: string;
  gender: string;
  age: string;
  password: string;
}

export const useAuth = () => useContext(AuthContext);