import { createContext, useState, useCallback, ReactNode } from 'react';
import { User, AuthContextType, SignUpData } from '../hooks/useAuth';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signUp: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const signUp = useCallback(async (userData: SignUpData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Signup failed');
      
      setUser({ username: userData.email, name: userData.name });
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}