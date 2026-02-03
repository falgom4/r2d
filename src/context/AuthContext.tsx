import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { R2Credentials, AuthState } from '@/types/credentials.types';

interface AuthContextType {
  credentials: R2Credentials | null;
  authState: AuthState;
  setCredentials: (creds: R2Credentials) => void;
  clearCredentials: () => void;
  setAuthState: (state: AuthState) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentialsState] = useState<R2Credentials | null>(
    null
  );
  const [authState, setAuthState] = useState<AuthState>('unauthenticated');

  const setCredentials = useCallback((creds: R2Credentials) => {
    setCredentialsState(creds);
    setAuthState('authenticated');
  }, []);

  const clearCredentials = useCallback(() => {
    setCredentialsState(null);
    setAuthState('unauthenticated');
  }, []);

  const isAuthenticated = authState === 'authenticated' && credentials !== null;

  return (
    <AuthContext.Provider
      value={{
        credentials,
        authState,
        setCredentials,
        clearCredentials,
        setAuthState,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
