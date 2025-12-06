export interface User {
  username: string;
  role: string;
  phoneNumber: string;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;

  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  devMode: boolean;  // 🔥 ajouté
}
