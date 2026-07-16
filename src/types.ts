export type ProjectCategory = "welder" | "wood";

export interface MaterialPurchase {
  id: string;
  date: string;
  name: string;
  quantity: number;
  cost: number;
  supplier: string;
  createdAt: number;
}

export interface Project {
  id: string;
  category: ProjectCategory;
  name: string;
  saleCost: number;
  saleDate: string;
  deliveryDate: string;
  photo?: string;
  materials: MaterialPurchase[];
  createdAt: number;
}

export type ProjectInput = Omit<Project, "id" | "materials" | "createdAt">;
export type MaterialInput = Omit<MaterialPurchase, "id" | "createdAt">;

/* Lista de precios */
export interface PriceItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  photo?: string;
  createdAt: number;
}
export type PriceItemInput = Omit<PriceItem, "id" | "createdAt">;

/* Sueldos */
export type PaymentType = "daily" | "weekly" | "biweekly" | "variable" | "custom";

export interface DayEntry {
  id: string;
  date: string;
  amount: number;
  note: string;
}

export interface SalaryEntry {
  id: string;
  date: string;
  person: string;
  paymentType: PaymentType;
  baseSalary: number;
  periodDays: number;
  workDays: number;
  amount: number;
  note: string;
  dayEntries: DayEntry[];
  createdAt: number;
}
export type SalaryInput = Omit<SalaryEntry, "id" | "createdAt">;

/* Gasto indirecto */
export interface IndirectExpense {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  createdAt: number;
}
export type IndirectExpenseInput = Omit<IndirectExpense, "id" | "createdAt">;

export type ViewKey =
  | "dashboard"
  | "welder"
  | "wood"
  | "price-welder"
  | "price-wood"
  | "salaries"
  | "indirect";