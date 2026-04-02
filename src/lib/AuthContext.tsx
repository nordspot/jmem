"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  plz: string;
  city: string;
  phone: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: { sku: string; name: string; price: number; quantity: number }[];
  customer: {
    name: string;
    email: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
    notes: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  user: Customer | null;
  token: string | null;
  orders: Order[];
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<Customer>) => Promise<string | null>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  plz: string;
  city: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "jmem-auth-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const saveToken = useCallback((t: string | null) => {
    setToken(t);
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = token || localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setUser(null);
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!res.ok) {
        saveToken(null);
        setUser(null);
        setOrders([]);
        return;
      }

      const data = await res.json();
      setUser(data.customer);
      setOrders(data.orders || []);
      if (!token) setToken(storedToken);
    } catch {
      // Network error - keep token, user might be offline
    } finally {
      setLoading(false);
    }
  }, [token, saveToken]);

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return data.error || "Anmeldung fehlgeschlagen.";
        }

        saveToken(data.token);
        setUser(data.customer);
        return null;
      } catch {
        return "Netzwerkfehler. Bitte versuche es erneut.";
      }
    },
    [saveToken]
  );

  const register = useCallback(
    async (regData: RegisterData): Promise<string | null> => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regData),
        });

        const data = await res.json();

        if (!res.ok) {
          return data.error || "Registrierung fehlgeschlagen.";
        }

        saveToken(data.token);
        setUser(data.customer);
        return null;
      } catch {
        return "Netzwerkfehler. Bitte versuche es erneut.";
      }
    },
    [saveToken]
  );

  const logout = useCallback(() => {
    saveToken(null);
    setUser(null);
    setOrders([]);
  }, [saveToken]);

  const updateProfile = useCallback(
    async (data: Partial<Customer>): Promise<string | null> => {
      const currentToken = token || localStorage.getItem(TOKEN_KEY);
      if (!currentToken) return "Nicht angemeldet.";

      try {
        const res = await fetch("/api/auth/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          return result.error || "Fehler beim Speichern.";
        }

        setUser(result.customer);
        return null;
      } catch {
        return "Netzwerkfehler. Bitte versuche es erneut.";
      }
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        orders,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
