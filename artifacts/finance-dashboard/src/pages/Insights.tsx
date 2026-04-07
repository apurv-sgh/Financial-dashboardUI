import { useMemo } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import {
  computeInsights,
  computeCategoryBreakdown,
  computeSummary,
  monthlyData,
} from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Award,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-card-border rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-bold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
            <span className="text-muted-foreground capitalize">{p.dataKey}</span>
          </div>
          <span className="font-semibold text-foreground">{formatCurrency(p.value)}</span>
        </div>
      ))}
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

interface InsightCardProps {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  sublabel?: string;
  variant: "positive" | "negative" | "neutral" | "info";
  delay?: number;
}

function InsightCard({ icon: Icon, label, value, sublabel, variant, delay = 0 }: InsightCardProps) {
  const configs = {
    positive: {
      gradient: "from-emerald-500 to-teal-500",
      glow: "rgba(16,185,129,0.3)",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    negative: {
      gradient: "from-rose-500 to-red-500",
      glow: "rgba(244,63,94,0.3)",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-600 dark:text-rose-400",
    },
    neutral: {
      gradient: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.3)",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
    },
    info: {
      gradient: "from-blue-500 to-violet-500",
      glow: "rgba(91,110,248,0.3)",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
  };
  const c = configs[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-card border border-card-border rounded-2xl p-5 flex items-start gap-4 shadow-sm cursor-default"
    >
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br",
          c.gradient
        )}
        style={{ boxShadow: `0 4px 16px ${c.glow}` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p
          className="text-2xl font-bold text-foreground mt-0.5"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Insights() {
  const { transactions } = useApp();

  const insights = useMemo(() => computeInsights(transactions), [transactions]);
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);
  const { totalExpenses } = useMemo(() => computeSummary(transactions), [transactions]);

  const monthlyCompare = monthlyData.map((m) => ({
    ...m,
    savings: m.income - m.expenses,
  }));

  const savingsRate = insights.savingsRate;
  const isPositiveExpense = insights.expenseDelta <= 0;
  const isPositiveIncome = insights.incomeDelta >= 0;

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={Award}
          label="Top Spending Category"
          value={insights.topCategory?.category || "—"}
          sublabel={insights.topCategory ? formatCurrency(insights.topCategory.amount) : "No data"}
          variant="info"
          delay={0}
        />
        <InsightCard
          icon={PiggyBank}
          label="Current Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          sublabel="of income this month"
          variant={savingsRate >= 20 ? "positive" : savingsRate >= 10 ? "neutral" : "negative"}
          delay={0.08}
        />
        <InsightCard
          icon={isPositiveExpense ? TrendingDown : TrendingUp}
          label="Expense Change"
          value={`${isPositiveExpense ? "" : "+"}${insights.expenseDelta.toFixed(1)}%`}
          sublabel="vs. previous month"
          variant={isPositiveExpense ? "positive" : "negative"}
          delay={0.16}
        />
        <InsightCard
          icon={isPositiveIncome ? TrendingUp : TrendingDown}
          label="Income Change"
          value={`${insights.incomeDelta >= 0 ? "+" : ""}${insights.incomeDelta.toFixed(1)}%`}
          sublabel="vs. previous month"
          variant={isPositiveIncome ? "positive" : "negative"}
          delay={0.24}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Comparison */}
        <motion.div
          variants={stagger.item}
          className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-foreground mb-1 text-sm">Monthly Comparison</h2>
          <p className="text-xs text-muted-foreground mb-5">Jan – Apr 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyCompare} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={3} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={38}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.4)", radius: 8 }} />
              <Bar dataKey="income" fill="#5b6ef8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="savings" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            {[
              { color: "#5b6ef8", label: "Income" },
              { color: "#f43f5e", label: "Expenses" },
              { color: "#10b981", label: "Savings" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Spending Breakdown */}
        <motion.div
          variants={stagger.item}
          className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
        >
          <h2 className="font-bold text-foreground mb-1 text-sm">Spending Breakdown</h2>
          <p className="text-xs text-muted-foreground mb-5">By category</p>
          <div className="space-y-3.5">
            {breakdown.slice(0, 7).map((b, i) => {
              const pct = totalExpenses > 0 ? (b.amount / totalExpenses) * 100 : 0;
              return (
                <div key={b.category} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: b.color }}
                      />
                      <span className="text-xs font-medium text-foreground">{b.category}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(b.amount)} · {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Financial Observations */}
      <motion.div
        variants={stagger.item}
        className="bg-card border border-card-border rounded-2xl p-5 shadow-sm"
      >
        <h2 className="font-bold text-foreground mb-1 text-sm">Financial Observations</h2>
        <p className="text-xs text-muted-foreground mb-5">Based on your current data</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              ok: savingsRate >= 20,
              msg: savingsRate >= 20
                ? `Great job! You are saving ${savingsRate.toFixed(0)}% of your income this month.`
                : savingsRate >= 10
                ? `Savings rate is ${savingsRate.toFixed(0)}%. Aim for 20%+ for stronger financial health.`
                : `Savings rate is only ${savingsRate.toFixed(0)}%. Review discretionary spending.`,
            },
            {
              ok: isPositiveExpense,
              msg: isPositiveExpense
                ? `Expenses decreased ${Math.abs(insights.expenseDelta).toFixed(1)}% vs. last month.`
                : `Expenses increased ${Math.abs(insights.expenseDelta).toFixed(1)}% vs. last month.`,
            },
            {
              ok: insights.topCategory
                ? insights.topCategory.amount < totalExpenses * 0.35
                : true,
              msg: insights.topCategory
                ? `Top category: ${insights.topCategory.category} at ${((insights.topCategory.amount / totalExpenses) * 100).toFixed(0)}% of total spending.`
                : "Add transactions to see spending patterns.",
            },
            {
              ok: isPositiveIncome,
              msg: isPositiveIncome
                ? `Income is up ${insights.incomeDelta.toFixed(1)}% from last month.`
                : `Income dropped ${Math.abs(insights.incomeDelta).toFixed(1)}% vs. last month.`,
            },
          ].map((obs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border",
                obs.ok
                  ? "bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/30"
                  : "bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/30"
              )}
            >
              {obs.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">{obs.msg}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
