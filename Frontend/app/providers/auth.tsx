import { createContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

type User = {
  username: string;
};

export const AuthContext = createContext({
  signIn: (user: User) => {},
  signOut: () => {},
  user: null as User | null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  return (
    <AuthContext.Provider value={{
      signIn: setUser,
      signOut: () => setUser(null),
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}