import type {
  Project,
  ProjectInput,
  MaterialInput,
  MaterialPurchase,
  PriceItem,
  PriceItemInput,
  SalaryEntry,
  SalaryInput,
  IndirectExpense,
  IndirectExpenseInput,
} from "@/types";

function uid(): string {
  return crypto.randomUUID();
}

/* ---------- Projects ---------- */
const PROJECTS_KEY = "taller_projects_v1";

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject(data: ProjectInput): Project {
  return {
    id: uid(),
    ...data,
    materials: [],
    createdAt: Date.now(),
  };
}

export function createMaterial(data: MaterialInput): MaterialPurchase {
  return {
    id: uid(),
    ...data,
    createdAt: Date.now(),
  };
}

export function materialsTotal(project: Project): number {
  return project.materials.reduce(
    (a, m) => a + (m.cost || 0) * (m.quantity || 0),
    0,
  );
}

export function projectMargin(project: Project): number {
  return (project.saleCost || 0) - materialsTotal(project);
}

/* ---------- Prices ---------- */
const PRICES_WELDER_KEY = "taller_prices_welder_v1";
const PRICES_WOOD_KEY = "taller_prices_wood_v1";

export function loadPricesWelder(): PriceItem[] {
  try {
    const raw = localStorage.getItem(PRICES_WELDER_KEY);
    return raw ? (JSON.parse(raw) as PriceItem[]) : [];
  } catch {
    return [];
  }
}

export function savePricesWelder(items: PriceItem[]) {
  localStorage.setItem(PRICES_WELDER_KEY, JSON.stringify(items));
}

export function loadPricesWood(): PriceItem[] {
  try {
    const raw = localStorage.getItem(PRICES_WOOD_KEY);
    return raw ? (JSON.parse(raw) as PriceItem[]) : [];
  } catch {
    return [];
  }
}

export function savePricesWood(items: PriceItem[]) {
  localStorage.setItem(PRICES_WOOD_KEY, JSON.stringify(items));
}

export function createPriceItem(data: PriceItemInput): PriceItem {
  return {
    id: uid(),
    ...data,
    createdAt: Date.now(),
  };
}

/* ---------- Salaries ---------- */
const SALARIES_KEY = "taller_salaries_v1";

export function loadSalaries(): SalaryEntry[] {
  try {
    const raw = localStorage.getItem(SALARIES_KEY);
    return raw ? (JSON.parse(raw) as SalaryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveSalaries(items: SalaryEntry[]) {
  localStorage.setItem(SALARIES_KEY, JSON.stringify(items));
}

export function createSalary(data: SalaryInput): SalaryEntry {
  return {
    id: uid(),
    ...data,
    createdAt: Date.now(),
  };
}

/* ---------- Indirect Expenses ---------- */
const INDIRECT_KEY = "taller_indirect_v1";

export function loadIndirect(): IndirectExpense[] {
  try {
    const raw = localStorage.getItem(INDIRECT_KEY);
    return raw ? (JSON.parse(raw) as IndirectExpense[]) : [];
  } catch {
    return [];
  }
}

export function saveIndirect(items: IndirectExpense[]) {
  localStorage.setItem(INDIRECT_KEY, JSON.stringify(items));
}

export function createIndirect(data: IndirectExpenseInput): IndirectExpense {
  return {
    id: uid(),
    ...data,
    createdAt: Date.now(),
  };
}

/* ---------- Formatters ---------- */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatDate(value: string): string {
  if (!value) return "—";
  try {
    const d = new Date(value + "T00:00:00");
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
}