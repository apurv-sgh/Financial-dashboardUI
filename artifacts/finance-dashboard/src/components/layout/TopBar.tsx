import { useLocation } from "wouter";
import { Moon, Sun, Menu, DollarSign } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { RoleToggle } from "@/components/RoleToggle";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, { label: string; sub: string }> = {
  "/": { label: "Overview", sub: "Your financial snapshot" },
  "/transactions": { label: "Transactions", sub: "Track every dollar" },
  "/insights": { label: "Insights", sub: "Understand your patterns" },
};

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Insights", href: "/insights" },
];

export function TopBar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const page = PAGE_TITLES[location] || { label: "Dashboard", sub: "" };

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-sm">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              FinTrack
            </span>
          </div>
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={location}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-sm font-semibold text-foreground leading-tight">{page.label}</h1>
                <p className="text-xs text-muted-foreground">{page.sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RoleToggle />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 20 }}
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            data-testid="button-topbar-theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="sidebar-mesh md:hidden fixed inset-y-0 left-0 z-40 w-64 flex flex-col pt-6 pb-4 px-3 gap-1 border-r border-sidebar-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <span
                  className="font-bold text-sidebar-foreground text-base"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  FinTrack
                </span>
              </div>
              {NAV_ITEMS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "block px-3 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                      location === href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                    onClick={() => setMobileOpen(false)}
                    data-testid={`mobile-nav-${label.toLowerCase()}`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
