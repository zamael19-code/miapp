import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PurchaseInput } from "@/types";

interface Props {
  initial?: Partial<PurchaseInput>;
  onSubmit: (data: PurchaseInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
  compact?: boolean;
}

export function PurchaseForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  compact = false,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initial?.date ?? today);
  const [project, setProject] = useState(initial?.project ?? "");
  const [extra, setExtra] = useState(initial?.extra ?? "");
  const [amount, setAmount] = useState<string>(
    initial?.amount != null ? String(initial.amount) : "",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDate(initial.date ?? today);
      setProject(initial.project ?? "");
      setExtra(initial.extra ?? "");
      setAmount(initial.amount != null ? String(initial.amount) : "");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!project.trim()) {
      setError("El proyecto es obligatorio");
      return;
    }
    if (!date) {
      setError("La fecha es obligatoria");
      return;
    }
    setError(null);
    onSubmit({
      date,
      project: project.trim(),
      extra: extra.trim(),
      amount: Number(amount) || 0,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-4" : "space-y-5"}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pf-date" className="text-emerald-900/80">
            Fecha
          </Label>
          <Input
            id="pf-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-emerald-200 bg-white focus-visible:ring-emerald-500/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-amount" className="text-emerald-900/80">
            Monto (USD)
          </Label>
          <Input
            id="pf-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-emerald-200 bg-white focus-visible:ring-emerald-500/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pf-project" className="text-emerald-900/80">
          Proyecto <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="pf-project"
          placeholder="Ej. Reforma cocina, Viaje, Equipo…"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="border-emerald-200 bg-white focus-visible:ring-emerald-500/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pf-extra" className="text-emerald-900/80">
          Extra / Notas
        </Label>
        <Textarea
          id="pf-extra"
          placeholder="Detalle adicional: proveedor, factura, observaciones…"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          rows={compact ? 3 : 4}
          className="resize-none border-emerald-200 bg-white focus-visible:ring-emerald-500/30"
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-emerald-900/70 hover:bg-emerald-50 hover:text-emerald-900"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500/40"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}