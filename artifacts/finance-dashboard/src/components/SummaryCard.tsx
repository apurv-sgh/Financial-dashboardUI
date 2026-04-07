import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  rawValue: number;
  subtext?: string;
  icon: LucideIcon;
  variant?: "balance" | "income" | "expense";
  trend?: number;
  delay?: number;
  testId?: string;
}

const VARIANTS = {
  balance: {
    card: "card-gradient-blue text-white glow-primary",
    icon: "bg-white/20 text-white",
    badge: "bg-white/20 text-white",
    title: "text-white/70",
    value: "text-white",
    sub: "text-white/60",
    pattern: true,
  },
  income: {
    card: "card-gradient-green text-white glow-green",
    icon: "bg-white/20 text-white",
    badge: "bg-white/20 text-white",
    title: "text-white/70",
    value: "text-white",
    sub: "text-white/60",
    pattern: false,
  },
  expense: {
    card: "card-gradient-rose text-white glow-rose",
    icon: "bg-white/20 text-white",
    badge: "bg-white/20 text-white",
    title: "text-white/70",
    value: "text-white",
    sub: "text-white/60",
    pattern: false,
  },
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function SummaryCard({
  title,
  rawValue,
  subtext,
  icon: Icon,
  variant = "balance",
  trend,
  delay = 0,
  testId,
}: SummaryCardProps) {
  const styles = VARIANTS[variant];
  const animated = useCountUp(rawValue, 1400, delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative rounded-2xl p-5 overflow-hidden cursor-default",
        styles.card
      )}
      data-testid={testId || "card-summary"}
    >
      {/* Decorative circles */}
      {styles.pattern && (
        <>
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <div
            className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.4)" }}
          />
        </>
      )}
      <div
        className="absolute top-3 right-3 w-20 h-20 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.5)" }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-4">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              styles.icon
            )}
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.4, duration: 0.3 }}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                styles.badge
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend >= 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </motion.div>
          )}
        </div>

        <p className={cn("text-xs font-semibold uppercase tracking-widest mb-1.5", styles.title)}>
          {title}
        </p>
        <p
          className={cn("text-3xl font-bold tracking-tight leading-none", styles.value)}
          data-testid={`value-${testId}`}
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {formatCurrency(animated)}
        </p>
        {subtext && (
          <p className={cn("text-xs mt-2", styles.sub)}>{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}
