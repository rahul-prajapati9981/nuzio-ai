import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  User,
} from "../types";
import api from "../services/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  register: (formData: RegisterFormData) => Promise<User>;
  login: (formData: LoginFormData) => Promise<User>;
  logout: () => void;
  updateInterests: (interests: string[]) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("nuzio_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem("nuzio_user");
      return null;
    }
  });

  const saveAuthentication = (response: AuthResponse) => {
    localStorage.setItem("nuzio_token", response.token);
    localStorage.setItem("nuzio_user", JSON.stringify(response.user));

    setUser(response.user);
  };

  const register = async (formData: RegisterFormData): Promise<User> => {
    const response = await api.post<AuthResponse>("/auth/register", formData);

    saveAuthentication(response.data);

    return response.data.user;
  };

  const login = async (formData: LoginFormData): Promise<User> => {
    const response = await api.post<AuthResponse>("/auth/login", formData);

    saveAuthentication(response.data);

    return response.data.user;
  };

  const logout = () => {
    window.speechSynthesis.cancel();
    localStorage.removeItem("nuzio_token");
    localStorage.removeItem("nuzio_user");
    setUser(null);
  };

  const updateInterests = (interests: string[]) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser = {
        ...currentUser,
        interests,
      };

      localStorage.setItem("nuzio_user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
      updateInterests,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
