import {
  LayoutDashboard,
  Flame,
  Hammer,
  Tag,
  Users,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewKey } from "@/types";

interface SidebarProps {
  current: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "welder", label: "Welder Project", icon: Flame, group: "Proyectos" },
  { key: "wood", label: "Wood Project", icon: Hammer, group: "Proyectos" },
  { key: "price-welder", label: "Precios Welder", icon: Tag, group: "Listas" },
  { key: "price-wood", label: "Precios Wood", icon: Tag, group: "Listas" },
  { key: "salaries", label: "Sueldos", icon: Users, group: "Operación" },
  { key: "indirect", label: "Gasto indirecto", icon: Receipt, group: "Operación" },
];

export function Sidebar({ current, onNavigate }: SidebarProps) {
  let lastGroup = "";
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30">
          <Flame className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-900">
            Taller App
          </p>
          <p className="text-xs text-slate-400">Gestión integral</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const showGroup = item.group && item.group !== lastGroup;
          if (item.group) lastGroup = item.group;
          const active = current === item.key;
          const Icon = item.icon;
          return (
            <div key={item.key}>
              {showGroup && (
                <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.group}
                </p>
              )}
              <button
                onClick={() => onNavigate(item.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/60 px-6 py-4">
        <p className="text-xs text-slate-400">
          Datos guardados localmente
        </p>
      </div>
    </aside>
  );
}