import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { transactions as initialTransactions, Transaction, TransactionCategory } from "@/data/mockData";

export type Role = "admin" | "viewer";
export type Theme = "light" | "dark";

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  theme: Theme;
  toggleTheme: () => void;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;
  filterType: "all" | "income" | "expense";
  setFilterType: (f: "all" | "income" | "expense") => void;
  filterCategory: TransactionCategory | "all";
  setFilterCategory: (c: TransactionCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: keyof Transaction;
  setSortField: (f: keyof Transaction) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (d: "asc" | "desc") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateId(): string {
  return "t" + Math.random().toString(36).substring(2, 10);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem("fin_role") as Role) || "viewer";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("fin_theme") as Theme) || "light";
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem("fin_transactions");
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialTransactions;
  });

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("fin_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("fin_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fin_role", role);
  }, [role]);

  const setRole = useCallback((r: Role) => setRoleState(r), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: generateId() }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, "id">>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
