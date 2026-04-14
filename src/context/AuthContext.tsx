import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_KEY } from "@/services/api";
import {
  login as loginService,
  register as registerService,
  getMe,
  selectBar as selectBarService,
  logout as logoutService,
} from "@/services/auth.service";
import { getBars } from "@/services/bar.service";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  barName: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  selectBar: (barId: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [barName, setBarName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBarName = useCallback(async (barId: string) => {
    try {
      const bars = await getBars();
      const bar = bars.find((b) => b.id === barId);
      if (bar) setBarName(bar.nome);
    } catch {}
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
      if (me.bar_id) {
        await loadBarName(me.bar_id);
      }
    } catch {
      setUser(null);
      setBarName(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  }, [loadBarName]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: u, token } = await loginService({ email, password });
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setUser(u);
      if (u.bar_id) await loadBarName(u.bar_id);
      return u;
    },
    [loadBarName],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { user: u, token } = await registerService({
        name,
        email,
        password,
      });
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setUser(u);
      return u;
    },
    [],
  );

  const selectBar = useCallback(
    async (barId: string) => {
      const u = await selectBarService(barId);
      setUser(u);
      await loadBarName(barId);
    },
    [loadBarName],
  );

  const logout = useCallback(async () => {
    await logoutService();
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setBarName(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        barName,
        loading,
        login,
        register,
        selectBar,
        logout,
        refreshUser,
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
