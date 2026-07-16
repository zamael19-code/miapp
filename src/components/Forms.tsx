import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import type {
  ProjectInput,
  MaterialInput,
  PriceItemInput,
  SalaryInput,
  IndirectExpenseInput,
  PaymentType,
  DayEntry,
} from "@/types";

const inputCls =
  "rounded-xl border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-blue-400/20";

const UNIT_OPTIONS = [
  "pieza",
  "metro",
  "litro",
  "kilogramo",
  "km",
  "unit",
  "caja",
  "bolsa",
  "tonelada",
  "hora",
  "jornada",
] as const;

/* ---------- Photo Upload ---------- */
interface PhotoUploadProps {
  value?: string;
  onChange: (photo: string | undefined) => void;
  label?: string;
}

function PhotoUpload({ value, onChange, label = "Foto del producto" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 800;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          onChange(compressed);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Foto producto"
            className="h-32 w-32 rounded-2xl border border-slate-200 object-cover shadow-sm"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400 transition-colors hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500"
        >
          <ImagePlus className="h-7 w-7" strokeWidth={1.8} />
          <span className="text-xs font-medium">Subir foto</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

/* ---------- Project Form ---------- */
interface ProjectFormProps {
  initial?: Partial<ProjectInput>;
  category: "welder" | "wood";
  onSubmit: (data: ProjectInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProjectForm({
  initial,
  category,
  onSubmit,
  onCancel,
  submitLabel = "Guardar proyecto",
}: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [saleCost, setSaleCost] = useState(
    initial?.saleCost != null ? String(initial.saleCost) : "",
  );
  const [saleDate, setSaleDate] = useState(initial?.saleDate ?? "");
  const [deliveryDate, setDeliveryDate] = useState(
    initial?.deliveryDate ?? "",
  );
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setSaleCost(initial.saleCost != null ? String(initial.saleCost) : "");
      setSaleDate(initial.saleDate ?? "");
      setDeliveryDate(initial.deliveryDate ?? "");
      setPhoto(initial.photo);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del proyecto es obligatorio");
      return;
    }
    setError(null);
    onSubmit({
      category,
      name: name.trim(),
      saleCost: Number(saleCost) || 0,
      saleDate,
      deliveryDate,
      photo,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <PhotoUpload value={photo} onChange={setPhoto} />
      <div className="space-y-1.5">
        <Label htmlFor="pj-name" className="text-xs font-medium text-slate-600">
          Nombre del proyecto <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="pj-name"
          placeholder="Ej. Remodelación oficina"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pj-sale" className="text-xs font-medium text-slate-600">
          Costo de venta (MXN)
        </Label>
        <Input
          id="pj-sale"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={saleCost}
          onChange={(e) => setSaleCost(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pj-sale-date" className="text-xs font-medium text-slate-600">
            Fecha de venta
          </Label>
          <Input
            id="pj-sale-date"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pj-delivery" className="text-xs font-medium text-slate-600">
            Fecha de entrega
          </Label>
          <Input
            id="pj-delivery"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}

/* ---------- Material Form ---------- */
interface MaterialFormProps {
  initial?: Partial<MaterialInput>;
  onSubmit: (data: MaterialInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function MaterialForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Agregar material",
}: MaterialFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initial?.date ?? today);
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(
    initial?.quantity != null ? String(initial.quantity) : "1",
  );
  const [cost, setCost] = useState(
    initial?.cost != null ? String(initial.cost) : "",
  );
  const [supplier, setSupplier] = useState(initial?.supplier ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDate(initial.date ?? today);
      setName(initial.name ?? "");
      setQuantity(initial.quantity != null ? String(initial.quantity) : "1");
      setCost(initial.cost != null ? String(initial.cost) : "");
      setSupplier(initial.supplier ?? "");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del material es obligatorio");
      return;
    }
    setError(null);
    onSubmit({
      date,
      name: name.trim(),
      quantity: Number(quantity) || 0,
      cost: Number(cost) || 0,
      supplier: supplier.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="m-date" className="text-xs font-medium text-slate-600">
            Fecha
          </Label>
          <Input
            id="m-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-supplier" className="text-xs font-medium text-slate-600">
            Proveedor
          </Label>
          <Input
            id="m-supplier"
            placeholder="Ej. Ferretería El Tornillo"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="m-name" className="text-xs font-medium text-slate-600">
          Nombre del material <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="m-name"
          placeholder="Ej. Cemento, Pintura blanca…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="m-qty" className="text-xs font-medium text-slate-600">
            Cantidad
          </Label>
          <Input
            id="m-qty"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-cost" className="text-xs font-medium text-slate-600">
            Costo unitario (MXN)
          </Label>
          <Input
            id="m-cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}

/* ---------- Price Item Form ---------- */
interface PriceFormProps {
  initial?: Partial<PriceItemInput>;
  onSubmit: (data: PriceItemInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function PriceForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}: PriceFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "pieza");
  const [quantity, setQuantity] = useState(
    initial?.quantity != null ? String(initial.quantity) : "1",
  );
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : "",
  );
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setUnit(initial.unit ?? "pieza");
      setQuantity(initial.quantity != null ? String(initial.quantity) : "1");
      setPrice(initial.price != null ? String(initial.price) : "");
      setPhoto(initial.photo);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    onSubmit({
      name: name.trim(),
      unit,
      quantity: Number(quantity) || 0,
      price: Number(price) || 0,
      photo,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <PhotoUpload value={photo} onChange={setPhoto} />
      <div className="space-y-1.5">
        <Label htmlFor="pr-name" className="text-xs font-medium text-slate-600">
          Nombre <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="pr-name"
          placeholder="Ej. Tubo estructural 2x2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pr-qty" className="text-xs font-medium text-slate-600">
            Cantidad
          </Label>
          <Input
            id="pr-qty"
            type="number"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pr-unit" className="text-xs font-medium text-slate-600">
            Unidad de medida
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger id="pr-unit" className={inputCls}>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pr-price" className="text-xs font-medium text-slate-600">
            Precio (MXN)
          </Label>
          <Input
            id="pr-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}

/* ---------- Salary Form ---------- */
interface SalaryFormProps {
  initial?: Partial<SalaryInput>;
  onSubmit: (data: SalaryInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const DEFAULT_PERIOD_DAYS: Record<PaymentType, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 15,
  variable: 0,
  custom: 7,
};

function uid(): string {
  return crypto.randomUUID();
}

export function SalaryForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}: SalaryFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initial?.date ?? today);
  const [person, setPerson] = useState(initial?.person ?? "");
  const [paymentType, setPaymentType] = useState<PaymentType>(
    initial?.paymentType ?? "weekly",
  );
  const [baseSalary, setBaseSalary] = useState(
    initial?.baseSalary != null ? String(initial.baseSalary) : "",
  );
  const [periodDays, setPeriodDays] = useState(
    initial?.periodDays != null ? String(initial.periodDays) : "7",
  );
  const [workDays, setWorkDays] = useState(
    initial?.workDays != null ? String(initial.workDays) : "7",
  );
  const [amount, setAmount] = useState(
    initial?.amount != null ? String(initial.amount) : "",
  );
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [autoCalc, setAutoCalc] = useState(true);

  const [dayEntries, setDayEntries] = useState<DayEntry[]>(
    initial?.dayEntries ?? [],
  );
  const [newDayDate, setNewDayDate] = useState(today);
  const [newDayAmount, setNewDayAmount] = useState("");
  const [newDayNote, setNewDayNote] = useState("");

  useEffect(() => {
    if (initial) {
      setDate(initial.date ?? today);
      setPerson(initial.person ?? "");
      setPaymentType(initial.paymentType ?? "weekly");
      setBaseSalary(initial.baseSalary != null ? String(initial.baseSalary) : "");
      setPeriodDays(
        initial.periodDays != null ? String(initial.periodDays) : "7",
      );
      setWorkDays(initial.workDays != null ? String(initial.workDays) : "7");
      setAmount(initial.amount != null ? String(initial.amount) : "");
      setNote(initial.note ?? "");
      setDayEntries(initial.dayEntries ?? []);
    }
  }, [initial]);

  useEffect(() => {
    if (paymentType === "variable") return;
    if (!autoCalc) return;
    const base = Number(baseSalary) || 0;
    const total = Number(periodDays) || 1;
    const worked = Number(workDays) || 0;
    const calculated = Math.round((base / total) * worked * 100) / 100;
    setAmount(calculated.toFixed(2));
  }, [baseSalary, periodDays, workDays, autoCalc, paymentType]);

  useEffect(() => {
    if (paymentType !== "variable") return;
    const sum = dayEntries.reduce((a, d) => a + (d.amount || 0), 0);
    setAmount(sum.toFixed(2));
  }, [dayEntries, paymentType]);

  function handlePaymentTypeChange(type: PaymentType) {
    setPaymentType(type);
    const defaultDays = DEFAULT_PERIOD_DAYS[type];
    if (type !== "variable") {
      setPeriodDays(String(defaultDays));
      if (type === "daily") setWorkDays("1");
      else if (type === "weekly") setWorkDays("7");
      else if (type === "biweekly") setWorkDays("15");
    }
  }

  function addDayEntry() {
    if (!newDayAmount) return;
    setDayEntries((prev) => [
      ...prev,
      {
        id: uid(),
        date: newDayDate,
        amount: Number(newDayAmount) || 0,
        note: newDayNote.trim(),
      },
    ]);
    setNewDayAmount("");
    setNewDayNote("");
  }

  function removeDayEntry(id: string) {
    setDayEntries((prev) => prev.filter((d) => d.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!person.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    onSubmit({
      date,
      person: person.trim(),
      paymentType,
      baseSalary: Number(baseSalary) || 0,
      periodDays: Number(periodDays) || 0,
      workDays: Number(workDays) || 0,
      amount: Number(amount) || 0,
      note: note.trim(),
      dayEntries: paymentType === "variable" ? dayEntries : [],
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="s-date" className="text-xs font-medium text-slate-600">
            Fecha
          </Label>
          <Input
            id="s-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-person" className="text-xs font-medium text-slate-600">
            Persona <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="s-person"
            placeholder="Ej. Juan Pérez"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="s-type" className="text-xs font-medium text-slate-600">
          Tipo de pago
        </Label>
        <Select value={paymentType} onValueChange={(v) => handlePaymentTypeChange(v as PaymentType)}>
          <SelectTrigger id="s-type" className={inputCls}>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diario</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="biweekly">Quincenal</SelectItem>
            <SelectItem value="variable">Pagos diversos (por día)</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentType === "variable" ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Días y montos individuales
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Registra cada día trabajado con su pago (ej. 500, 250, 1000…)
            </p>
          </div>

          {dayEntries.length > 0 && (
            <div className="space-y-2">
              {dayEntries.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 rounded-xl bg-white p-2.5 shadow-sm"
                >
                  <span className="flex-1 text-xs text-slate-500">
                    {d.date}
                  </span>
                  {d.note && (
                    <span className="flex-1 truncate text-xs text-slate-400">
                      {d.note}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-900">
                    ${d.amount.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDayEntry(d.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 rounded-xl bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Input
                type="date"
                value={newDayDate}
                onChange={(e) => setNewDayDate(e.target.value)}
                className={inputCls}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Monto"
                value={newDayAmount}
                onChange={(e) => setNewDayAmount(e.target.value)}
                className={inputCls}
              />
              <Input
                placeholder="Nota (opcional)"
                value={newDayNote}
                onChange={(e) => setNewDayNote(e.target.value)}
                className={inputCls}
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addDayEntry}
              disabled={!newDayAmount}
              className="w-full rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40"
            >
              <Plus className="mr-1 h-3.5 w-3.5" strokeWidth={2.5} /> Agregar día
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-50/60 px-3 py-2">
            <span className="text-xs font-medium text-blue-700">
              Total calculado
            </span>
            <span className="text-sm font-bold text-blue-900">
              ${dayEntries.reduce((a, d) => a + (d.amount || 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="s-base" className="text-xs font-medium text-slate-600">
              Sueldo base del periodo (MXN)
            </Label>
            <Input
              id="s-base"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-period" className="text-xs font-medium text-slate-600">
                Días del periodo
              </Label>
              <Input
                id="s-period"
                type="number"
                min="1"
                step="1"
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-worked" className="text-xs font-medium text-slate-600">
                Días trabajados
              </Label>
              <Input
                id="s-worked"
                type="number"
                min="0"
                step="1"
                value={workDays}
                onChange={(e) => setWorkDays(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="s-amount" className="text-xs font-medium text-slate-600">
                Monto a pagar (MXN)
              </Label>
              <button
                type="button"
                onClick={() => setAutoCalc((a) => !a)}
                className={`text-xs font-medium transition-colors ${autoCalc ? "text-blue-600" : "text-slate-400"}`}
              >
                {autoCalc ? "Calculado automáticamente" : "Edición manual"}
              </button>
            </div>
            <Input
              id="s-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              readOnly={autoCalc}
              className={`${inputCls} ${autoCalc ? "cursor-not-allowed bg-blue-50/50" : ""}`}
            />
            {autoCalc && (
              <p className="text-xs text-slate-400">
                Calculado: (sueldo base ÷ días del periodo) × días trabajados
              </p>
            )}
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="s-note" className="text-xs font-medium text-slate-600">
          Nota
        </Label>
        <Input
          id="s-note"
          placeholder="Ej. Adelanto, horas extra…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}

/* ---------- Indirect Expense Form ---------- */
interface IndirectFormProps {
  initial?: Partial<IndirectExpenseInput>;
  onSubmit: (data: IndirectExpenseInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function IndirectForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}: IndirectFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initial?.date ?? today);
  const [name, setName] = useState(initial?.name ?? "");
  const [amount, setAmount] = useState(
    initial?.amount != null ? String(initial.amount) : "",
  );
  const [category, setCategory] = useState(initial?.category ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setDate(initial.date ?? today);
      setName(initial.name ?? "");
      setAmount(initial.amount != null ? String(initial.amount) : "");
      setCategory(initial.category ?? "");
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    onSubmit({
      date,
      name: name.trim(),
      amount: Number(amount) || 0,
      category: category.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="i-date" className="text-xs font-medium text-slate-600">
            Fecha
          </Label>
          <Input
            id="i-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="i-cat" className="text-xs font-medium text-slate-600">
            Categoría
          </Label>
          <Input
            id="i-cat"
            placeholder="Ej. Luz, Renta, Gasolina…"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="i-name" className="text-xs font-medium text-slate-600">
          Nombre <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="i-name"
          placeholder="Ej. Pago de luz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="i-amount" className="text-xs font-medium text-slate-600">
          Monto (MXN)
        </Label>
        <Input
          id="i-amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputCls}
        />
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}
      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}

/* ---------- Shared form actions ---------- */
function FormActions({
  onCancel,
  submitLabel,
}: {
  onCancel?: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="rounded-full px-5 text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </Button>
      )}
      <Button
        type="submit"
        className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-5 text-white shadow-sm shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
      >
        {submitLabel}
      </Button>
    </div>
  );
}