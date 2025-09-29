import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "user" | "admin";
type User = { id: string; email: string; role: Role; password: string }; // NOTE: demo only (localStorage)

type AuthResult = { success: boolean; message: string };

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, role?: Role) => Promise<AuthResult>;
  logout: () => void;
  validatePassword: (pw: string) => { ok: boolean; reasons: string[] };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "np_users";
const SESSION_KEY = "np_session_user";
const ADMIN_DEFAULT = { email: "admin@yourshop.com", password: "Admin#2025!" };

function normalizeEmail(email: string) {
  const [local, domain] = email.trim().toLowerCase().split("@");
  if (!domain) return email.trim().toLowerCase();
  // Gmail normalization: remove dots and +tags
  if (domain === "gmail.com") {
    const noPlus = local.split("+")[0];
    const noDots = noPlus.replace(/\./g, "");
    return `${noDots}@${domain}`;
  }
  return `${local}@${domain}`;
}

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedAdminIfMissing() {
  const users = loadUsers();
  const exists = users.some(u => normalizeEmail(u.email) === normalizeEmail(ADMIN_DEFAULT.email));
  if (!exists) {
    users.push({
      id: crypto.randomUUID(),
      email: ADMIN_DEFAULT.email,
      role: "admin",
      password: ADMIN_DEFAULT.password,
    });
    saveUsers(users);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Seed default admin once
  useEffect(() => {
    seedAdminIfMissing();
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const users = loadUsers();
      const found = users.find(u => u.id === sessionId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const validatePassword = (pw: string) => {
    const reasons: string[] = [];
    if (pw.length < 10) reasons.push("At least 10 characters");
    if (!/[a-z]/.test(pw)) reasons.push("At least one lowercase letter");
    if (!/[A-Z]/.test(pw)) reasons.push("At least one uppercase letter");
    if (!/[0-9]/.test(pw)) reasons.push("At least one digit");
    if (!/[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/~`]/.test(pw)) reasons.push("At least one special character");
    return { ok: reasons.length === 0, reasons };
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const users = loadUsers();
    const nEmail = normalizeEmail(email);
    const found = users.find(u => normalizeEmail(u.email) === nEmail && u.password === password);
    if (!found) {
      return { success: false, message: "Invalid email or password" };
    }
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    return { success: true, message: "Logged in successfully" };
  };

  const signup = async (email: string, password: string, role: Role = "user"): Promise<AuthResult> => {
    const pwd = validatePassword(password);
    if (!pwd.ok) {
      return { success: false, message: `Weak password: ${pwd.reasons.join(", ")}` };
    }
    const users = loadUsers();
    const nEmail = normalizeEmail(email);
    if (users.some(u => normalizeEmail(u.email) === nEmail)) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser: User = { id: crypto.randomUUID(), email, role, password };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return { success: true, message: "Account created successfully" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === "admin",
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
      validatePassword,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
