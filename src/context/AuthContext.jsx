import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // The backend has no "who am I" route, so after login we save the user
  // in localStorage. That way the user stays logged in after a refresh.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // call this after login or after profile update
  const saveUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // logout -> tell backend to clear the cookie, then clear our own copy
  const logout = async () => {
    try {
      await api.get("/user/logout");
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// small helper so we can write useAuth() in any component
export const useAuth = () => useContext(AuthContext);
