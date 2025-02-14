export interface AuthContextType {
    login: (userId: string, password: string) => Promise<void>;
    logout: () => void;
    user: object | null;
    loading: boolean;
  }
  