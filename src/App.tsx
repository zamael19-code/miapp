import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Plus,
  Pencil,
  Trash2,
  PackageOpen,
  DollarSign,
  CalendarDays,
  Truck,
  ChevronDown,
  Flame,
  Hammer,
  Tag,
  Users,
  Receipt,
  Clock,
  Layers,
  Ruler,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/Sidebar";
import {
  ProjectForm,
  MaterialForm,
  PriceForm,
  SalaryForm,
  IndirectForm,
} from "@/components/Forms";
import type {
  Project,
  ProjectInput,
  MaterialInput,
  PriceItem,
  PriceItemInput,
  SalaryEntry,
  SalaryInput,
  IndirectExpense,
  IndirectExpenseInput,
  ViewKey,
  PaymentType,
} from "@/types";
import {
  loadProjects,
  saveProjects,
  createProject,
  createMaterial,
  loadPricesWelder,
  savePricesWelder,
  loadPricesWood,
  savePricesWood,
  loadSalaries,
  saveSalaries,
  loadIndirect,
  saveIndirect,
  createPriceItem,
  createSalary,
  createIndirect,
  formatCurrency,
  formatDate,
  materialsTotal,
  projectMargin,
} from "@/lib/storage";

const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  daily: "Diario",
  weekly: "Semanal",
  biweekly: "Quincenal",
  variable: "Pagos diversos",
  custom: "Personalizado",
};

export default function App() {
  const [view, setView] = useState<ViewKey>("dashboard");

  const [projects, setProjects] = useState<Project[]>([]);
  const [pricesWelder, setPricesWelder] = useState<PriceItem[]>([]);
  const [pricesWood, setPricesWood] = useState<PriceItem[]>([]);
  const [salaries, setSalaries] = useState<SalaryEntry[]>([]);
  const [indirect, setIndirect] = useState<IndirectExpense[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
    setPricesWelder(loadPricesWelder());
    setPricesWood(loadPricesWood());
    setSalaries(loadSalaries());
    setIndirect(loadIndirect());
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);
  useEffect(() => {
    savePricesWelder(pricesWelder);
  }, [pricesWelder]);
  useEffect(() => {
    savePricesWood(pricesWood);
  }, [pricesWood]);
  useEffect(() => {
    saveSalaries(salaries);
  }, [salaries]);
  useEffect(() => {
    saveIndirect(indirect);
  }, [indirect]);

  /* ---- Project handlers ---- */
  function handleCreateProject(data: ProjectInput) {
    setProjects((prev) => [createProject(data), ...prev]);
  }
  function handleEditProject(id: string, data: ProjectInput) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  }
  function handleDeleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }
  function handleAddMaterial(projectId: string, data: MaterialInput) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, materials: [...p.materials, createMaterial(data)] }
          : p,
      ),
    );
  }
  function handleEditMaterial(
    projectId: string,
    materialId: string,
    data: MaterialInput,
  ) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              materials: p.materials.map((m) =>
                m.id === materialId ? { ...m, ...data } : m,
              ),
            }
          : p,
      ),
    );
  }
  function handleDeleteMaterial(projectId: string, materialId: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, materials: p.materials.filter((m) => m.id !== materialId) }
          : p,
      ),
    );
  }

  /* ---- Price handlers ---- */
  function handleCreatePrice(
    list: "welder" | "wood",
    data: PriceItemInput,
  ) {
    const item = createPriceItem(data);
    if (list === "welder") setPricesWelder((prev) => [item, ...prev]);
    else setPricesWood((prev) => [item, ...prev]);
  }
  function handleEditPrice(
    list: "welder" | "wood",
    id: string,
    data: PriceItemInput,
  ) {
    const setter = list === "welder" ? setPricesWelder : setPricesWood;
    setter((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
    );
  }
  function handleDeletePrice(list: "welder" | "wood", id: string) {
    const setter = list === "welder" ? setPricesWelder : setPricesWood;
    setter((prev) => prev.filter((p) => p.id !== id));
  }

  /* ---- Salary handlers ---- */
  function handleCreateSalary(data: SalaryInput) {
    setSalaries((prev) => [createSalary(data), ...prev]);
  }
  function handleEditSalary(id: string, data: SalaryInput) {
    setSalaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
    );
  }
  function handleDeleteSalary(id: string) {
    setSalaries((prev) => prev.filter((s) => s.id !== id));
  }

  /* ---- Indirect handlers ---- */
  function handleCreateIndirect(data: IndirectExpenseInput) {
    setIndirect((prev) => [createIndirect(data), ...prev]);
  }
  function handleEditIndirect(id: string, data: IndirectExpenseInput) {
    setIndirect((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data } : i)),
    );
  }
  function handleDeleteIndirect(id: string) {
    setIndirect((prev) => prev.filter((i) => i.id !== id));
  }

  const titles: Record<ViewKey, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Resumen financiero del taller",
    },
    welder: {
      title: "Welder Project",
      subtitle: "Proyectos de herrería",
    },
    wood: {
      title: "Wood Project",
      subtitle: "Proyectos de carpintería",
    },
    "price-welder": {
      title: "Lista de precios Welder",
      subtitle: "Materiales y servicios de herrería",
    },
    "price-wood": {
      title: "Lista de precios Wood",
      subtitle: "Materiales y servicios de carpintería",
    },
    salaries: {
      title: "Sueldos",
      subtitle: "Pagos a personal del taller",
    },
    indirect: {
      title: "Gasto indirecto",
      subtitle: "Gastos operativos del taller",
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-slate-100 via-blue-50/40 to-slate-100 font-sans">
      <Sidebar current={view} onNavigate={setView} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-6 py-4 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {titles[view].title}
            </h1>
            <p className="text-sm text-slate-500">
              {titles[view].subtitle}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "dashboard" && (
            <DashboardView
              projects={projects}
              salaries={salaries}
              indirect={indirect}
            />
          )}
          {view === "welder" && (
            <ProjectsView
              category="welder"
              projects={projects}
              onCreate={handleCreateProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onAddMaterial={handleAddMaterial}
              onEditMaterial={handleEditMaterial}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}
          {view === "wood" && (
            <ProjectsView
              category="wood"
              projects={projects}
              onCreate={handleCreateProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onAddMaterial={handleAddMaterial}
              onEditMaterial={handleEditMaterial}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}
          {view === "price-welder" && (
            <PriceView
              items={pricesWelder}
              onCreate={(d) => handleCreatePrice("welder", d)}
              onEdit={(id, d) => handleEditPrice("welder", id, d)}
              onDelete={(id) => handleDeletePrice("welder", id)}
            />
          )}
          {view === "price-wood" && (
            <PriceView
              items={pricesWood}
              onCreate={(d) => handleCreatePrice("wood", d)}
              onEdit={(id, d) => handleEditPrice("wood", id, d)}
              onDelete={(id) => handleDeletePrice("wood", id)}
            />
          )}
          {view === "salaries" && (
            <SalaryView
              items={salaries}
              onCreate={handleCreateSalary}
              onEdit={handleEditSalary}
              onDelete={handleDeleteSalary}
            />
          )}
          {view === "indirect" && (
            <IndirectView
              items={indirect}
              onCreate={handleCreateIndirect}
              onEdit={handleEditIndirect}
              onDelete={handleDeleteIndirect}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ============== Dashboard View ============== */
interface DashboardViewProps {
  projects: Project[];
  salaries: SalaryEntry[];
  indirect: IndirectExpense[];
}

function DashboardView({ projects, salaries, indirect }: DashboardViewProps) {
  const stats = useMemo(() => {
    const income = projects.reduce((a, p) => a + (p.saleCost || 0), 0);
    const materialsCost = projects.reduce(
      (a, p) => a + materialsTotal(p),
      0,
    );
    const salariesCost = salaries.reduce((a, s) => a + (s.amount || 0), 0);
    const indirectCost = indirect.reduce((a, i) => a + (i.amount || 0), 0);
    const totalExpenses = materialsCost + salariesCost + indirectCost;
    const profit = income - totalExpenses;

    return {
      income,
      materialsCost,
      salariesCost,
      indirectCost,
      totalExpenses,
      profit,
      projectCount: projects.length,
    };
  }, [projects, salaries, indirect]);

  const chartData = [
    { name: "Ingresos", value: stats.income, type: "income" },
    { name: "Materiales", value: stats.materialsCost, type: "expense" },
    { name: "Sueldos", value: stats.salariesCost, type: "expense" },
    { name: "Indirectos", value: stats.indirectCost, type: "expense" },
  ];

  const profitTone =
    stats.profit > 0
      ? "from-emerald-500 to-teal-600"
      : stats.profit < 0
        ? "from-rose-500 to-red-600"
        : "from-slate-400 to-slate-500";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Income */}
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ingresos
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(stats.income)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stats.projectCount} proyecto(s)
            </p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gastos
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <TrendingDown className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(stats.totalExpenses)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Materiales + Sueldos + Indirectos
            </p>
          </CardContent>
        </Card>

        {/* Profit */}
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ganancia
              </p>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${profitTone} text-white shadow-sm`}
              >
                <Wallet className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            <p
              className={`mt-3 text-2xl font-bold tracking-tight ${stats.profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {stats.profit >= 0 ? "+" : ""}
              {formatCurrency(stats.profit)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {stats.profit >= 0 ? "Utilidad" : "Pérdida"}
            </p>
          </CardContent>
        </Card>

        {/* Margin */}
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Margen
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BarChart3 className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {stats.income > 0
                ? `${((stats.profit / stats.income) * 100).toFixed(1)}%`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Ganancia / Ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 p-5">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Ingresos vs Gastos
            </h3>
            <p className="text-sm text-slate-500">
              Comparativa de ingresos y gastos por categoría
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "0.875rem",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Monto"]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.type === "income"
                          ? "#4f46e5"
                          : entry.name === "Materiales"
                            ? "#3b82f6"
                            : entry.name === "Sueldos"
                              ? "#0ea5e9"
                              : "#6366f1"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 p-5">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Desglose de gastos
            </h3>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            <BreakdownRow
              label="Materiales"
              value={stats.materialsCost}
              total={stats.totalExpenses}
              color="bg-blue-500"
            />
            <BreakdownRow
              label="Sueldos"
              value={stats.salariesCost}
              total={stats.totalExpenses}
              color="bg-sky-500"
            />
            <BreakdownRow
              label="Gastos indirectos"
              value={stats.indirectCost}
              total={stats.totalExpenses}
              color="bg-indigo-500"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 p-5">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Resumen
            </h3>
          </CardHeader>
          <CardContent className="space-y-2.5 p-5">
            <SummaryRow
              label="Total de ingresos"
              value={formatCurrency(stats.income)}
              tone="text-blue-600"
            />
            <SummaryRow
              label="Total de gastos"
              value={formatCurrency(stats.totalExpenses)}
              tone="text-rose-600"
            />
            <div className="my-2 h-px bg-slate-100" />
            <SummaryRow
              label="Ganancia neta"
              value={`${stats.profit >= 0 ? "+" : ""}${formatCurrency(stats.profit)}`}
              tone={stats.profit >= 0 ? "text-emerald-600" : "text-rose-600"}
              bold
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {formatCurrency(value)}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">{pct.toFixed(1)}% del total</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-semibold text-slate-700" : "text-slate-500"}`}>
        {label}
      </span>
      <span className={`${bold ? "text-base font-bold" : "text-sm font-semibold"} ${tone}`}>
        {value}
      </span>
    </div>
  );
}

/* ============== Projects View ============== */
interface ProjectsViewProps {
  category: "welder" | "wood";
  projects: Project[];
  onCreate: (d: ProjectInput) => void;
  onEdit: (id: string, d: ProjectInput) => void;
  onDelete: (id: string) => void;
  onAddMaterial: (pid: string, d: MaterialInput) => void;
  onEditMaterial: (pid: string, mid: string, d: MaterialInput) => void;
  onDeleteMaterial: (pid: string, mid: string) => void;
}

function ProjectsView({
  category,
  projects,
  onCreate,
  onEdit,
  onDelete,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
}: ProjectsViewProps) {
  const [adding, setAdding] = useState(false);
  const filtered = projects.filter((p) => p.category === category);
  const Icon = category === "welder" ? Flame : Hammer;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filtered.length} proyecto(s) registrado(s)
        </p>
        <Button
          onClick={() => setAdding(true)}
          className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-1 h-4 w-4" strokeWidth={2.5} /> Proyecto
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={`Sin proyectos de ${category === "welder" ? "herrería" : "carpintería"}`}
          subtitle="Crea tu primer proyecto con el botón superior."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              defaultOpen={i === 0}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddMaterial={onAddMaterial}
              onEditMaterial={onEditMaterial}
              onDeleteMaterial={onDeleteMaterial}
            />
          ))}
        </div>
      )}

      <Dialog open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              {category === "welder" ? "Nuevo Welder Project" : "Nuevo Wood Project"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Completa los datos del proyecto de{" "}
              {category === "welder" ? "herrería" : "carpintería"}.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            category={category}
            submitLabel="Crear proyecto"
            onCancel={() => setAdding(false)}
            onSubmit={(data) => {
              onCreate(data);
              setAdding(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== Project Card ============== */
interface ProjectCardProps {
  project: Project;
  defaultOpen?: boolean;
  onEdit: (id: string, d: ProjectInput) => void;
  onDelete: (id: string) => void;
  onAddMaterial: (pid: string, d: MaterialInput) => void;
  onEditMaterial: (pid: string, mid: string, d: MaterialInput) => void;
  onDeleteMaterial: (pid: string, mid: string) => void;
}

function ProjectCard({
  project,
  defaultOpen = false,
  onEdit,
  onDelete,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
}: ProjectCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [addingMat, setAddingMat] = useState(false);
  const [editMat, setEditMat] = useState<MaterialInput | null>(null);
  const [editMatId, setEditMatId] = useState<string | null>(null);
  const [confirmMat, setConfirmMat] = useState<string | null>(null);

  const totalMat = materialsTotal(project);
  const margin = projectMargin(project);
  const marginTone =
    margin > 0
      ? "bg-blue-100 text-blue-700"
      : margin < 0
        ? "bg-rose-100 text-rose-600"
        : "bg-slate-100 text-slate-600";

  return (
    <>
      <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
        <CardHeader className="cursor-pointer gap-0 p-0">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-slate-50/50"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
                  {project.name}
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${marginTone}`}>
                  {margin >= 0 ? "+" : ""}
                  {formatCurrency(margin)}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatCurrency(project.saleCost)}
                </span>
                <span className="flex items-center gap-1">
                  <PackageOpen className="h-3.5 w-3.5" />
                  {formatCurrency(totalMat)}
                </span>
                <span>{project.materials.length} compra(s)</span>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              strokeWidth={2.2}
            />
          </button>
        </CardHeader>

        {open && (
          <CardContent className="space-y-4 border-t border-slate-100 bg-slate-50/40 p-5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <DollarSign className="h-3.5 w-3.5" /> Costo de venta
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                  {formatCurrency(project.saleCost)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" /> Fecha de venta
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDate(project.saleDate)}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Truck className="h-3.5 w-3.5" /> Fecha de entrega
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDate(project.deliveryDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmDel(true)}
                className="rounded-full border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Eliminar
              </Button>
            </div>

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Compra de materiales
                </h4>
                <Button
                  size="sm"
                  onClick={() => setAddingMat(true)}
                  className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-3 text-xs font-medium text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} /> Agregar
                </Button>
              </div>

              {project.materials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 px-4 py-8 text-center">
                  <p className="text-sm text-slate-400">
                    Sin compras de materiales registradas.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {project.materials.map((m) => {
                    const sub = (m.cost || 0) * (m.quantity || 0);
                    return (
                      <div
                        key={m.id}
                        className="group flex items-start justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-slate-900">
                              {m.name}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              x{m.quantity}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                            <span>{formatDate(m.date)}</span>
                            {m.supplier && <span>· {m.supplier}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatCurrency(sub)}
                          </span>
                          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditMat({
                                  date: m.date,
                                  name: m.name,
                                  quantity: m.quantity,
                                  cost: m.cost,
                                  supplier: m.supplier,
                                });
                                setEditMatId(m.id);
                              }}
                              className="h-7 w-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setConfirmMat(m.id)}
                              className="h-7 w-7 rounded-full p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {project.materials.length > 0 && (
                <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-blue-50/60 px-4 py-2.5">
                  <span className="text-xs font-medium text-blue-700">
                    Total materiales
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    {formatCurrency(totalMat)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Edit project */}
      <Dialog open={editing} onOpenChange={(o) => !o && setEditing(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Editar proyecto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Modifica los datos del proyecto.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            category={project.category}
            initial={{
              name: project.name,
              saleCost: project.saleCost,
              saleDate: project.saleDate,
              deliveryDate: project.deliveryDate,
            }}
            submitLabel="Guardar cambios"
            onCancel={() => setEditing(false)}
            onSubmit={(data) => {
              onEdit(project.id, data);
              setEditing(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete project */}
      <Dialog open={confirmDel} onOpenChange={(o) => !o && setConfirmDel(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-rose-600">
              Eliminar proyecto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Se eliminará el proyecto y todas sus compras. Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDel(false)}
              className="rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onDelete(project.id);
                setConfirmDel(false);
              }}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add material */}
      <Dialog open={addingMat} onOpenChange={(o) => !o && setAddingMat(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Compra de material
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Registra una compra para «{project.name}».
            </DialogDescription>
          </DialogHeader>
          <MaterialForm
            submitLabel="Agregar"
            onCancel={() => setAddingMat(false)}
            onSubmit={(data) => {
              onAddMaterial(project.id, data);
              setAddingMat(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit material */}
      <Dialog open={!!editMat} onOpenChange={(o) => !o && setEditMat(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Editar material
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Modifica los datos de la compra.
            </DialogDescription>
          </DialogHeader>
          {editMat && (
            <MaterialForm
              initial={editMat}
              submitLabel="Guardar cambios"
              onCancel={() => setEditMat(null)}
              onSubmit={(data) => {
                if (editMatId) onEditMaterial(project.id, editMatId, data);
                setEditMat(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete material */}
      <Dialog open={!!confirmMat} onOpenChange={(o) => !o && setConfirmMat(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-rose-600">
              Eliminar material
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              ¿Seguro que quieres eliminar esta compra?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmMat(null)}
              className="rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmMat) onDeleteMaterial(project.id, confirmMat);
                setConfirmMat(null);
              }}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ============== Price View ============== */
interface PriceViewProps {
  items: PriceItem[];
  onCreate: (d: PriceItemInput) => void;
  onEdit: (id: string, d: PriceItemInput) => void;
  onDelete: (id: string) => void;
}

function PriceView({ items, onCreate, onEdit, onDelete }: PriceViewProps) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<PriceItem | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {items.length} concepto(s) en la lista
        </p>
        <Button
          onClick={() => setAdding(true)}
          className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-1 h-4 w-4" strokeWidth={2.5} /> Agregar
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Lista de precios vacía"
          subtitle="Agrega materiales o servicios con su precio."
        />
      ) : (
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="divide-y divide-slate-100">
            {items.map((it) => (
              <div
                key={it.id}
                className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{it.name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" />
                      {it.quantity} {it.unit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(it.price)}
                  </span>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(it)}
                      className="h-7 w-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDel(it.id)}
                      className="h-7 w-7 rounded-full p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Agregar a lista de precios
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Registra un material o servicio.
            </DialogDescription>
          </DialogHeader>
          <PriceForm
            submitLabel="Agregar"
            onCancel={() => setAdding(false)}
            onSubmit={(data) => {
              onCreate(data);
              setAdding(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Editar precio
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Modifica los datos del concepto.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <PriceForm
              initial={{
                name: editing.name,
                unit: editing.unit,
                quantity: editing.quantity,
                price: editing.price,
              }}
              submitLabel="Guardar cambios"
              onCancel={() => setEditing(null)}
              onSubmit={(data) => {
                onEdit(editing.id, data);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-rose-600">
              Eliminar concepto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              ¿Seguro que quieres eliminar este precio?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDel(null)}
              className="rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmDel) onDelete(confirmDel);
                setConfirmDel(null);
              }}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== Salary View ============== */
interface SalaryViewProps {
  items: SalaryEntry[];
  onCreate: (d: SalaryInput) => void;
  onEdit: (id: string, d: SalaryInput) => void;
  onDelete: (id: string) => void;
}

function SalaryView({ items, onCreate, onEdit, onDelete }: SalaryViewProps) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<SalaryEntry | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const total = items.reduce((a, s) => a + (s.amount || 0), 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {items.length} pago(s) registrado(s)
          </p>
          <p className="text-lg font-bold tracking-tight text-slate-900">
            Total: {formatCurrency(total)}
          </p>
        </div>
        <Button
          onClick={() => setAdding(true)}
          className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-1 h-4 w-4" strokeWidth={2.5} /> Agregar
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin sueldos registrados"
          subtitle="Registra pagos por día, semana, quincena o montos diversos."
        />
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <Card
              key={s.id}
              className="group overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {s.person}
                    </p>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {PAYMENT_TYPE_LABELS[s.paymentType]}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(s.date)}
                    </span>
                    {s.paymentType === "variable" ? (
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        {s.dayEntries.length} día(s) con pago
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {s.workDays} / {s.periodDays} días
                      </span>
                    )}
                    {s.paymentType !== "variable" && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        Base: {formatCurrency(s.baseSalary)}
                      </span>
                    )}
                  </div>

                  {s.paymentType === "variable" &&
                    s.dayEntries.length > 0 && (
                      <div className="mt-2.5 space-y-1">
                        {s.dayEntries.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
                          >
                            <span className="text-xs text-slate-500">
                              {formatDate(d.date)}
                            </span>
                            {d.note && (
                              <span className="flex-1 truncate text-xs text-slate-400">
                                {d.note}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-700">
                              {formatCurrency(d.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  {s.note && (
                    <p className="mt-1.5 text-xs text-slate-400">Nota: {s.note}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Monto</p>
                    <p className="text-base font-bold tracking-tight text-slate-900">
                      {formatCurrency(s.amount)}
                    </p>
                  </div>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(s)}
                      className="h-7 w-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDel(s.id)}
                      className="h-7 w-7 rounded-full p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Registrar sueldo
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Calcula el pago según el tipo y días trabajados.
            </DialogDescription>
          </DialogHeader>
          <SalaryForm
            submitLabel="Agregar"
            onCancel={() => setAdding(false)}
            onSubmit={(data) => {
              onCreate(data);
              setAdding(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Editar sueldo
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Modifica los datos del pago.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <SalaryForm
              initial={{
                date: editing.date,
                person: editing.person,
                paymentType: editing.paymentType,
                baseSalary: editing.baseSalary,
                periodDays: editing.periodDays,
                workDays: editing.workDays,
                amount: editing.amount,
                note: editing.note,
                dayEntries: editing.dayEntries,
              }}
              submitLabel="Guardar cambios"
              onCancel={() => setEditing(null)}
              onSubmit={(data) => {
                onEdit(editing.id, data);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-rose-600">
              Eliminar sueldo
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              ¿Seguro que quieres eliminar este pago?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDel(null)}
              className="rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmDel) onDelete(confirmDel);
                setConfirmDel(null);
              }}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== Indirect View ============== */
interface IndirectViewProps {
  items: IndirectExpense[];
  onCreate: (d: IndirectExpenseInput) => void;
  onEdit: (id: string, d: IndirectExpenseInput) => void;
  onDelete: (id: string) => void;
}

function IndirectView({ items, onCreate, onEdit, onDelete }: IndirectViewProps) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<IndirectExpense | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const total = items.reduce((a, i) => a + (i.amount || 0), 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {items.length} gasto(s) indirecto(s)
          </p>
          <p className="text-lg font-bold tracking-tight text-slate-900">
            Total: {formatCurrency(total)}
          </p>
        </div>
        <Button
          onClick={() => setAdding(true)}
          className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-4 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-1 h-4 w-4" strokeWidth={2.5} /> Agregar
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin gastos indirectos"
          subtitle="Registra gastos operativos como luz, renta, gasolina…"
        />
      ) : (
        <Card className="overflow-hidden rounded-3xl border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="divide-y divide-slate-100">
            {items.map((it) => (
              <div
                key={it.id}
                className="group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50/50"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{it.name}</p>
                    {it.category && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {it.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formatDate(it.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(it.amount)}
                  </span>
                  <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(it)}
                      className="h-7 w-7 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDel(it.id)}
                      className="h-7 w-7 rounded-full p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Registrar gasto indirecto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Captura un gasto operativo.
            </DialogDescription>
          </DialogHeader>
          <IndirectForm
            submitLabel="Agregar"
            onCancel={() => setAdding(false)}
            onSubmit={(data) => {
              onCreate(data);
              setAdding(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
              Editar gasto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Modifica los datos del gasto.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <IndirectForm
              initial={{
                date: editing.date,
                name: editing.name,
                amount: editing.amount,
                category: editing.category,
              }}
              submitLabel="Guardar cambios"
              onCancel={() => setEditing(null)}
              onSubmit={(data) => {
                onEdit(editing.id, data);
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent className="rounded-3xl border-slate-200/60 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold tracking-tight text-rose-600">
              Eliminar gasto
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              ¿Seguro que quieres eliminar este gasto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmDel(null)}
              className="rounded-full text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmDel) onDelete(confirmDel);
                setConfirmDel(null);
              }}
              className="rounded-full bg-rose-500 text-white hover:bg-rose-600"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== Empty State ============== */
function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/60 px-6 py-16 text-center backdrop-blur-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
        <Icon className="h-8 w-8" strokeWidth={1.8} />
      </div>
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}