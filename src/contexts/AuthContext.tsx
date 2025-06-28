import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser(token);
          setUser(currentUser);
        } catch (err) {
          console.error('Error fetching user:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await authService.register(name, email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
