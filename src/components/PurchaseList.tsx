import { useState } from "react";
import { Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PurchaseForm } from "@/components/PurchaseForm";
import type { Purchase, PurchaseInput } from "@/types";
import { formatCurrency, formatDate } from "@/lib/storage";

interface Props {
  items: Purchase[];
  onEdit: (id: string, data: PurchaseInput) => void;
  onDelete: (id: string) => void;
}

export function PurchaseList({ items, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Package className="h-6 w-6" />
        </div>
        <p className="font-serif text-lg text-emerald-900">Sin compras registradas</p>
        <p className="mt-1 text-sm text-emerald-700/70">
          Agrega tu primera compra usando el panel de la izquierda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((p) => (
          <article
            key={p.id}
            className="group rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    {p.project}
                  </span>
                  <span className="text-xs font-medium text-emerald-700/60">
                    {formatDate(p.date)}
                  </span>
                </div>
                {p.extra && (
                  <p className="mt-2 text-sm text-slate-600">{p.extra}</p>
                )}
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                <span className="font-serif text-lg font-semibold text-emerald-900">
                  {formatCurrency(p.amount)}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(p)}
                    className="h-8 px-2 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmId(p.id)}
                    className="h-8 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Editar */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="border-emerald-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-emerald-900">
              Editar compra
            </DialogTitle>
            <DialogDescription>
              Modifica los campos y guarda los cambios.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <PurchaseForm
              initial={{
                date: editing.date,
                project: editing.project,
                extra: editing.extra,
                amount: editing.amount,
              }}
              compact
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

      {/* Confirmar eliminar */}
      <Dialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-rose-700">
              Eliminar compra
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Seguro que quieres eliminar el
              registro?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setConfirmId(null)}
              className="text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (confirmId) onDelete(confirmId);
                setConfirmId(null);
              }}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}