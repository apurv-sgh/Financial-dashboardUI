export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Shopping"
  | "Housing"
  | "Transport"
  | "Entertainment"
  | "Healthcare"
  | "Education"
  | "Utilities"
  | "Travel"
  | "Gifts"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  merchant?: string;
}

export const CATEGORIES: TransactionCategory[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Food & Dining",
  "Shopping",
  "Housing",
  "Transport",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Travel",
  "Gifts",
  "Other",
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "Salary",
  "Freelance",
  "Investment",
];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "Food & Dining",
  "Shopping",
  "Housing",
  "Transport",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Travel",
  "Gifts",
  "Other",
];

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Salary: "#5b6ef8",
  Freelance: "#4f46e5",
  Investment: "#818cf8",
  "Food & Dining": "#f59e0b",
  Shopping: "#ec4899",
  Housing: "#06b6d4",
  Transport: "#84cc16",
  Entertainment: "#a855f7",
  Healthcare: "#10b981",
  Education: "#3b82f6",
  Utilities: "#f97316",
  Travel: "#14b8a6",
  Gifts: "#e879f9",
  Other: "#94a3b8",
};

export const transactions: Transaction[] = [
  // April 2026
  { id: "t001", date: "2026-04-06", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income", merchant: "Acme Corp" },
  { id: "t002", date: "2026-04-05", description: "Grocery Shopping", amount: 143.50, category: "Food & Dining", type: "expense", merchant: "Whole Foods" },
  { id: "t003", date: "2026-04-04", description: "Netflix Subscription", amount: 17.99, category: "Entertainment", type: "expense", merchant: "Netflix" },
  { id: "t004", date: "2026-04-04", description: "Freelance Design Project", amount: 850, category: "Freelance", type: "income", merchant: "Studio X" },
  { id: "t005", date: "2026-04-03", description: "Electricity Bill", amount: 92.30, category: "Utilities", type: "expense", merchant: "City Power" },
  { id: "t006", date: "2026-04-03", description: "Uber Ride", amount: 22.50, category: "Transport", type: "expense", merchant: "Uber" },
  { id: "t007", date: "2026-04-02", description: "Amazon Purchase", amount: 67.99, category: "Shopping", type: "expense", merchant: "Amazon" },
  { id: "t008", date: "2026-04-01", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "City Apartments" },
  { id: "t009", date: "2026-04-01", description: "Spotify Premium", amount: 10.99, category: "Entertainment", type: "expense", merchant: "Spotify" },
  { id: "t010", date: "2026-04-01", description: "Dividend Income", amount: 320, category: "Investment", type: "income", merchant: "Fidelity" },

  // March 2026
  { id: "t011", date: "2026-03-31", description: "Restaurant Dinner", amount: 89.40, category: "Food & Dining", type: "expense", merchant: "The Golden Fork" },
  { id: "t012", date: "2026-03-30", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income", merchant: "Acme Corp" },
  { id: "t013", date: "2026-03-28", description: "Gym Membership", amount: 49.99, category: "Healthcare", type: "expense", merchant: "FitLife" },
  { id: "t014", date: "2026-03-27", description: "Online Course", amount: 129, category: "Education", type: "expense", merchant: "Coursera" },
  { id: "t015", date: "2026-03-25", description: "Coffee Shop", amount: 14.75, category: "Food & Dining", type: "expense", merchant: "Blue Bottle" },
  { id: "t016", date: "2026-03-24", description: "Freelance Writing", amount: 400, category: "Freelance", type: "income", merchant: "ContentHub" },
  { id: "t017", date: "2026-03-22", description: "Phone Bill", amount: 55.00, category: "Utilities", type: "expense", merchant: "T-Mobile" },
  { id: "t018", date: "2026-03-20", description: "Weekend Trip - Hotel", amount: 340, category: "Travel", type: "expense", merchant: "Hilton" },
  { id: "t019", date: "2026-03-19", description: "Pharmacy", amount: 38.60, category: "Healthcare", type: "expense", merchant: "CVS" },
  { id: "t020", date: "2026-03-18", description: "Gas Station", amount: 58.40, category: "Transport", type: "expense", merchant: "Shell" },
  { id: "t021", date: "2026-03-15", description: "Clothing Store", amount: 213.00, category: "Shopping", type: "expense", merchant: "Nordstrom" },
  { id: "t022", date: "2026-03-14", description: "Birthday Gift", amount: 75, category: "Gifts", type: "expense", merchant: "Amazon" },
  { id: "t023", date: "2026-03-12", description: "Stock Dividends", amount: 180, category: "Investment", type: "income", merchant: "Schwab" },
  { id: "t024", date: "2026-03-10", description: "Internet Bill", amount: 79.99, category: "Utilities", type: "expense", merchant: "Comcast" },
  { id: "t025", date: "2026-03-05", description: "Lunch with Team", amount: 64.20, category: "Food & Dining", type: "expense", merchant: "Chipotle" },
  { id: "t026", date: "2026-03-03", description: "Car Insurance", amount: 148, category: "Transport", type: "expense", merchant: "State Farm" },
  { id: "t027", date: "2026-03-01", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "City Apartments" },

  // February 2026
  { id: "t028", date: "2026-02-28", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income", merchant: "Acme Corp" },
  { id: "t029", date: "2026-02-26", description: "Valentine's Dinner", amount: 172, category: "Food & Dining", type: "expense", merchant: "Aria Restaurant" },
  { id: "t030", date: "2026-02-24", description: "Freelance Dev Work", amount: 1200, category: "Freelance", type: "income", merchant: "TechStart" },
  { id: "t031", date: "2026-02-22", description: "Sushi Night", amount: 78.50, category: "Food & Dining", type: "expense", merchant: "Nobu" },
  { id: "t032", date: "2026-02-20", description: "Apple Store", amount: 249, category: "Shopping", type: "expense", merchant: "Apple" },
  { id: "t033", date: "2026-02-18", description: "Weekend Getaway Flight", amount: 428, category: "Travel", type: "expense", merchant: "Delta Airlines" },
  { id: "t034", date: "2026-02-15", description: "Music Concert", amount: 95, category: "Entertainment", type: "expense", merchant: "Live Nation" },
  { id: "t035", date: "2026-02-14", description: "Gifts - Valentine", amount: 125, category: "Gifts", type: "expense", merchant: "Tiffany & Co" },
  { id: "t036", date: "2026-02-12", description: "Doctor Visit", amount: 80, category: "Healthcare", type: "expense", merchant: "City Clinic" },
  { id: "t037", date: "2026-02-10", description: "Investment Returns", amount: 520, category: "Investment", type: "income", merchant: "Fidelity" },
  { id: "t038", date: "2026-02-07", description: "Supermarket", amount: 187.30, category: "Food & Dining", type: "expense", merchant: "Trader Joe's" },
  { id: "t039", date: "2026-02-05", description: "Streaming Bundle", amount: 45.97, category: "Entertainment", type: "expense", merchant: "Disney+" },
  { id: "t040", date: "2026-02-01", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "City Apartments" },

  // January 2026
  { id: "t041", date: "2026-01-31", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income", merchant: "Acme Corp" },
  { id: "t042", date: "2026-01-29", description: "New Year Gym Plan", amount: 299, category: "Healthcare", type: "expense", merchant: "Equinox" },
  { id: "t043", date: "2026-01-27", description: "Book Store", amount: 56.80, category: "Education", type: "expense", merchant: "Barnes & Noble" },
  { id: "t044", date: "2026-01-24", description: "Restaurant", amount: 92.50, category: "Food & Dining", type: "expense", merchant: "Nobu" },
  { id: "t045", date: "2026-01-22", description: "Freelance Consulting", amount: 650, category: "Freelance", type: "income", merchant: "ConsultCo" },
  { id: "t046", date: "2026-01-20", description: "Home Supplies", amount: 134.60, category: "Shopping", type: "expense", merchant: "IKEA" },
  { id: "t047", date: "2026-01-17", description: "Car Maintenance", amount: 320, category: "Transport", type: "expense", merchant: "AutoCare" },
  { id: "t048", date: "2026-01-15", description: "Tax Refund", amount: 1840, category: "Other", type: "income", merchant: "IRS" },
  { id: "t049", date: "2026-01-12", description: "Utilities Bundle", amount: 178.40, category: "Utilities", type: "expense", merchant: "City Utilities" },
  { id: "t050", date: "2026-01-10", description: "Movie Night", amount: 36.50, category: "Entertainment", type: "expense", merchant: "AMC Cinemas" },
  { id: "t051", date: "2026-01-07", description: "Stock Sale Profit", amount: 760, category: "Investment", type: "income", merchant: "Schwab" },
  { id: "t052", date: "2026-01-05", description: "Grocery Store", amount: 162.80, category: "Food & Dining", type: "expense", merchant: "Safeway" },
  { id: "t053", date: "2026-01-01", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense", merchant: "City Apartments" },
];

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export const monthlyData: MonthlyData[] = [
  { month: "Jan", income: 8450, expenses: 3280, balance: 5170 },
  { month: "Feb", income: 6920, expenses: 3240, balance: 3680 },
  { month: "Mar", income: 5780, expenses: 2918, balance: 2862 },
  { month: "Apr", income: 6370, expenses: 2154, balance: 4216 },
];

export function computeSummary(txns: Transaction[]) {
  const totalIncome = txns
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = txns
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
}

export function computeCategoryBreakdown(txns: Transaction[]) {
  const expenses = txns.filter((t) => t.type === "expense");
  const map: Record<string, number> = {};
  for (const t of expenses) {
    map[t.category] = (map[t.category] || 0) + t.amount;
  }
  return Object.entries(map)
    .map(([category, amount]) => ({
      category: category as TransactionCategory,
      amount,
      color: CATEGORY_COLORS[category as TransactionCategory],
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeInsights(txns: Transaction[]) {
  const breakdown = computeCategoryBreakdown(txns);
  const topCategory = breakdown[0];

  const currentMonth = txns.filter((t) => t.date.startsWith("2026-04"));
  const previousMonth = txns.filter((t) => t.date.startsWith("2026-03"));

  const currentExpenses = currentMonth
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const previousExpenses = previousMonth
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const currentIncome = currentMonth
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const previousIncome = previousMonth
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenseDelta = previousExpenses
    ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
    : 0;
  const incomeDelta = previousIncome
    ? ((currentIncome - previousIncome) / previousIncome) * 100
    : 0;

  const savingsRate =
    currentIncome > 0
      ? ((currentIncome - currentExpenses) / currentIncome) * 100
      : 0;

  return {
    topCategory,
    expenseDelta,
    incomeDelta,
    savingsRate,
    currentExpenses,
    previousExpenses,
    currentIncome,
    previousIncome,
  };
}
