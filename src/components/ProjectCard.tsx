import { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  PackageOpen,
  CalendarDays,
  Truck,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm, MaterialForm } from "@/components/Forms";
import type {
  Project,
  ProjectInput,
  MaterialInput,
  MaterialPurchase,
} from "@/types";
import {
  formatCurrency,
  formatDate,
  materialsTotal,
  projectMargin,
} from "@/lib/storage";

interface Props {
  project: Project;
  onEdit: (id: string, data: ProjectInput) => void;
  onDelete: (id: string) => void;
  onAddMaterial: (projectId: string, data: MaterialInput) => void;
  onEditMaterial: (
    projectId: string,
    materialId: string,
    data: MaterialInput,
  ) => void;
  onDeleteMaterial: (projectId: string, materialId: string) => void;
  defaultOpen?: boolean;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [addingMat, setAddingMat] = useState(false);
  const [editMat, setEditMat] = useState<MaterialPurchase | null>(null);
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
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${marginTone}`}
                >
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
            {/* Datos del proyecto */}
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

            {/* Acciones proyecto */}
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

            {/* Materiales */}
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
                              onClick={() => setEditMat(m)}
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

      {/* Editar proyecto */}
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

      {/* Eliminar proyecto */}
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

      {/* Agregar material */}
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

      {/* Editar material */}
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
              initial={{
                date: editMat.date,
                name: editMat.name,
                quantity: editMat.quantity,
                cost: editMat.cost,
                supplier: editMat.supplier,
              }}
              submitLabel="Guardar cambios"
              onCancel={() => setEditMat(null)}
              onSubmit={(data) => {
                onEditMaterial(project.id, editMat.id, data);
                setEditMat(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminar material */}
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