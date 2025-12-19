// ------------------------------
// USER MODEL
// ------------------------------
export interface User {
  username: string;
  role: string;
  phoneNumber: string;
  email?: string;   // facultatif mais ton backend le renvoie !
  id?: number;      // facultatif mais présent dans la réponse
}

// ------------------------------
// LOGIN PAYLOAD
// ------------------------------
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

// ------------------------------
// AUTH RESPONSE (JAVA BACKEND)
// ------------------------------
export interface AuthResponse {
  accessToken: string;       // <-- backend renvoie ce champ
  refreshToken?: string;
  tokenType?: string;
  user?: User;               // backend renvoie toujours un utilisateur
}

// ------------------------------
// AUTH CONTEXT SHAPE
// ------------------------------
export interface AuthContextType {
  user: User | null;
  token: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;

  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}
