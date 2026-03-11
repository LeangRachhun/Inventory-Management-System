import React, { createContext, useState, useContext } from "react";
import type { User } from "../types";

//Context value type
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.JSX.Element }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("ims_user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("ims_user", JSON.stringify(userData));
    localStorage.setItem("ims_token", token);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ims_user");
    localStorage.removeItem("ims_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthProvider;
