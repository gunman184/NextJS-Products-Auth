"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
  ReactNode,
} from "react";

interface Auth {
  accessToken: string | null;
  user: any | null; // Replace 'any' with your user type
  roles: string[];
}

interface AuthContextType {
  auth: Auth;
  setAuth: Dispatch<SetStateAction<Auth>>;
  isAuthReady: boolean;
  loggingOut: RefObject<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth>({
    accessToken: null,
    user: null,
    roles: [],
  });

  const loggingOut = useRef(false); // shared ref here

  const [isAuthReady, setIsAuthReady] = useState(false);

  // Multi-tab logout sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "logout") {
        setAuth({ accessToken: null, user: null, roles: [] });
      }
    };

    window.addEventListener("storage", handleStorage);
    setIsAuthReady(true); // mark context ready on initial mount

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthReady, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume auth context
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
};

export default AuthContext;
