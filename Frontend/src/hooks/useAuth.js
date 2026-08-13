import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { useToast } from "../contexts/ToastContext";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/auth/status")
      .then((res) => {
        if (!mounted) return;
        setUser(res.data?.authenticated ? res.data.user : null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const logout = async () => {
    try {
      await api.get("/auth/logout");
      addToast("Logged out successfully", "success");
    } catch (err) {
      addToast("Logout failed", "error");
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  return { user, loading, logout };
}
