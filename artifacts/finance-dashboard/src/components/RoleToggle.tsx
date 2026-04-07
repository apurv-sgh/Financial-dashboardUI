import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Shield, Eye } from "lucide-react";

export function RoleToggle() {
  const { role, setRole } = useApp();

  return (
    <div
      className="flex items-center bg-muted rounded-xl p-0.5 gap-0.5 relative"
      data-testid="role-toggle"
    >
      <motion.button
        onClick={() => setRole("viewer")}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 z-10 ${
          role === "viewer"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-testid="button-role-viewer"
      >
        {role === "viewer" && (
          <motion.div
            layoutId="role-pill"
            className="absolute inset-0 bg-background rounded-lg shadow-xs"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <Eye className="w-3 h-3 relative z-10" />
        <span className="relative z-10">Viewer</span>
      </motion.button>

      <motion.button
        onClick={() => setRole("admin")}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 z-10 ${
          role === "admin"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-testid="button-role-admin"
      >
        {role === "admin" && (
          <motion.div
            layoutId="role-pill"
            className="absolute inset-0 bg-primary rounded-lg shadow-xs"
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
          />
        )}
        <Shield className="w-3 h-3 relative z-10" />
        <span className="relative z-10">Admin</span>
      </motion.button>
    </div>
  );
}
