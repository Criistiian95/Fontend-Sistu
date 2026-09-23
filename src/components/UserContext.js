import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api, getToken, clearSession } from "../api";
const Context = createContext(null);
export const getUserIdFromLocalStorage = () =>
  sessionStorage.getItem("userId") || localStorage.getItem("userId");
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/user/profile");
      setUser(data.user);
    } catch (e) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    const logout = () => {
      clearSession();
      setUser(null);
      setLoading(false);
    };
    window.addEventListener("sismed:logout", logout);
    return () => window.removeEventListener("sismed:logout", logout);
  }, [refresh]);
  return (
    <Context.Provider value={{ user, setUser, loading, error, refresh }}>
      {children}
    </Context.Provider>
  );
}
export const useUser = () => useContext(Context);
