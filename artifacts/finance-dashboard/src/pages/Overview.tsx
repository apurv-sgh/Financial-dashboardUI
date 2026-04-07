import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { SummaryCard } from "@/components/SummaryCard";
import {
  computeSummary,
  computeCategoryBreakdown,
  monthlyData,
} from "@/data/mockData";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-xl p-3 text-sm min-w-36">
      <p className="font-bold text-foreground mb-2 text-xs">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize text-xs">{p.dataKey}</span>
          </div>
          <span className="font-semibold text-foreground text-xs">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-card-border rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground text-xs">{payload[0].name}</p>
      <p className="text-muted-foreground text-xs">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  },
};

export default function Overview() {
  const { transactions } = useApp();

  const { totalIncome, totalExpenses, balance } = useMemo(
    () => computeSummary(transactions),
    [transactions]
  );

  const categoryBreakdown = useMemo(
    () => computeCategoryBreakdown(transactions),
    [transactions]
  );

  const recentTxns = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [transactions]
  );

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Summary Cards */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Balance"
          rawValue={balance}
          subtext="Net worth across all time"
          icon={Wallet}
          variant="balance"
          delay={0}
          testId="card-balance"
        />
        <SummaryCard
          title="Total Income"
          rawValue={totalIncome}
          subtext="All time earnings"
          icon={TrendingUp}
          variant="income"
          delay={0.1}
          testId="card-income"
        />
        <SummaryCard
          title="Total Expenses"
          rawValue={totalExpenses}
          subtext="All time spending"
          icon={TrendingDown}
          variant="expense"
          delay={0.2}
          testId="card-expenses"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Balance Trend */}
        <motion.div
          variants={stagger.item}
          className="lg:col-span-3 bg-card border border-card-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-sm">Monthly Overview</h2>
                <p className="text-xs text-muted-foreground">Jan – Apr 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b6ef8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5b6ef8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={38}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#5b6ef8"
                strokeWidth={2.5}
                fill="url(#gradIncome)"
                dot={{ r: 4, fill: "#5b6ef8", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, stroke: "#5b6ef8", strokeWidth: 2, fill: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fill="url(#gradExpenses)"
                dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, stroke: "#f43f5e", strokeWidth: 2, fill: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div
          variants={stagger.item}
          className="lg:col-span-2 bg-card border border-card-border rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">Category Split</h2>
              <p className="text-xs text-muted-foreground">By spending</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={categoryBreakdown.slice(0, 6)}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={66}
                paddingAngle={3}
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {categoryBreakdown.slice(0, 6).map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {categoryBreakdown.slice(0, 5).map((entry) => {
              const pct = totalExpenses > 0
                ? ((entry.amount / totalExpenses) * 100).toFixed(0)
                : "0";
              return (
                <motion.div
                  key={entry.category}
                  className="flex items-center gap-2"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground flex-1 truncate">{entry.category}</span>
                  <div className="h-1 w-14 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: entry.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-7 text-right">{pct}%</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        variants={stagger.item}
        className="bg-card border border-card-border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground text-sm">Recent Transactions</h2>
            <p className="text-xs text-muted-foreground">Latest activity</p>
          </div>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div data-testid="recent-transactions">
          {recentTxns.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No transactions yet</p>
          )}
          {recentTxns.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.35 }}
              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)", x: 2 }}
              className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border/50 last:border-0 transition-colors cursor-default"
              data-testid={`row-recent-${t.id}`}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                  t.type === "income"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-rose-100 dark:bg-rose-900/30"
                )}
              >
                {t.type === "income" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground">
                  {t.merchant && `${t.merchant} · `}
                  {format(parseISO(t.date), "MMM d, yyyy")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={cn(
                    "text-sm font-bold",
                    t.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                  )}
                >
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </span>
                <p className="text-xs text-muted-foreground">{t.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
