import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return { isAuthenticated: false, role: null, token: null };

    try {
      const decoded = jwtDecode(token);
      return {
        isAuthenticated: true,
        role: decoded.role,
        token,
      };
    } catch (err) {
      localStorage.removeItem("token");
      return { isAuthenticated: false, role: null, token: null };
    }
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
