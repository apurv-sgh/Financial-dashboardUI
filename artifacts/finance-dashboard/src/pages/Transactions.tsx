import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  Transaction,
  TransactionCategory,
} from "@/data/mockData";
import { TransactionModal } from "@/components/TransactionModal";
import { format, parseISO } from "date-fns";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function exportCSV(txns: Transaction[]) {
  const header = "Date,Description,Category,Type,Amount,Merchant\n";
  const rows = txns
    .map(
      (t) =>
        `${t.date},"${t.description}","${t.category}","${t.type}",${t.amount},"${t.merchant || ""}"`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type SortField = keyof Transaction;

export default function Transactions() {
  const {
    role,
    transactions,
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
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterType !== "all") list = list.filter((t) => t.type === filterType);
    if (filterCategory !== "all") list = list.filter((t) => t.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.merchant || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let av: string | number = a[sortField] as string | number;
      let bv: string | number = b[sortField] as string | number;
      if (sortField === "amount") {
        av = Number(av);
        bv = Number(bv);
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, filterType, filterCategory, searchQuery, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setPage(1);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-35" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-primary" />
    );
  }

  const hasActiveFilters =
    filterType !== "all" || filterCategory !== "all" || searchQuery.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
            All Transactions
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            <motion.span
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filtered.length}
            </motion.span>{" "}
            result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            data-testid="button-export-csv"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </motion.button>
          {role === "admin" && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingTxn(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:opacity-95 transition-all"
              style={{ boxShadow: "0 4px 14px rgba(91,110,248,0.4)" }}
              data-testid="button-add-transaction"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by name, category, or merchant..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground transition-shadow"
            data-testid="input-search"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters((f) => !f)}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all",
            showFilters || hasActiveFilters
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-card text-foreground hover:bg-muted"
          )}
          data-testid="button-filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </motion.button>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setFilterType("all");
              setFilterCategory("all");
              setSearchQuery("");
              setPage(1);
            }}
            className="flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-filters"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 flex-wrap bg-muted/40 border border-border rounded-xl p-3.5">
              <div className="flex items-center gap-1 bg-background rounded-lg p-0.5">
                {(["all", "income", "expense"] as const).map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => { setFilterType(t); setPage(1); }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                      filterType === t
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    data-testid={`filter-type-${t}`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value as TransactionCategory | "all"); setPage(1); }}
                className="text-sm bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                data-testid="select-filter-category"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="transactions-table">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-5 py-3.5">
                  <button
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                    onClick={() => handleSort("date")}
                    data-testid="sort-date"
                  >
                    Date <SortIcon field="date" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5">
                  <button
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                    onClick={() => handleSort("description")}
                    data-testid="sort-description"
                  >
                    Description <SortIcon field="description" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Category
                  </span>
                </th>
                <th className="text-left px-5 py-3.5 hidden md:table-cell">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Type
                  </span>
                </th>
                <th className="text-right px-5 py-3.5">
                  <button
                    className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                    onClick={() => handleSort("amount")}
                    data-testid="sort-amount"
                  >
                    Amount <SortIcon field="amount" />
                  </button>
                </th>
                {role === "admin" && (
                  <th className="px-4 py-3.5" />
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                        <Search className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">No transactions found</p>
                      <p className="text-muted-foreground/60 text-xs">Try adjusting your filters</p>
                    </motion.div>
                  </td>
                </tr>
              )}
              <AnimatePresence mode="popLayout">
                {paginated.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
                    data-testid={`row-txn-${t.id}`}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-muted-foreground">
                      {format(parseISO(t.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground truncate max-w-44 text-sm">{t.description}</div>
                      {t.merchant && (
                        <div className="text-xs text-muted-foreground">{t.merchant}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: CATEGORY_COLORS[t.category] + "20",
                          color: CATEGORY_COLORS[t.category],
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                          t.type === "income"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                        )}
                      >
                        {t.type === "income" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold text-sm",
                          t.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-foreground"
                        )}
                      >
                        {t.type === "income" ? "+" : "−"}
                        {formatCurrency(t.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <AnimatePresence mode="wait">
                            {deleteConfirmId === t.id ? (
                              <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-1"
                              >
                                <button
                                  onClick={() => { deleteTransaction(t.id); setDeleteConfirmId(null); }}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-destructive text-destructive-foreground hover:opacity-80 transition-opacity font-medium"
                                  data-testid={`button-confirm-delete-${t.id}`}
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2.5 py-1 rounded-lg text-xs bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                  data-testid={`button-cancel-delete-${t.id}`}
                                >
                                  Cancel
                                </button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="actions"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-1"
                              >
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => { setEditingTxn(t); setModalOpen(true); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                  data-testid={`button-edit-${t.id}`}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setDeleteConfirmId(t.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  data-testid={`button-delete-${t.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} total
            </span>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors font-medium"
                data-testid="button-prev-page"
              >
                Prev
              </motion.button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = i + 1;
                return (
                  <motion.button
                    key={pg}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPage(pg)}
                    className={cn(
                      "w-7 h-7 text-xs rounded-lg transition-all font-medium",
                      page === pg
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                    data-testid={`button-page-${pg}`}
                  >
                    {pg}
                  </motion.button>
                );
              })}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-border disabled:opacity-30 hover:bg-muted transition-colors font-medium"
                data-testid="button-next-page"
              >
                Next
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      <TransactionModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTxn(null); }}
        transaction={editingTxn}
      />
    </motion.div>
  );
}
