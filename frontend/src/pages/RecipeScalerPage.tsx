import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Select } from "antd";
import SavedEntriesBar from "../components/SavedEntriesBar";
import ToolPageShell from "../components/ToolPageShell";

interface RecipeRow {
  id: number;
  name: string;
  qty: number | null;
  unit: string;
}

interface SavedState {
  rows: RecipeRow[];
  originalYield: number | null;
  targetYield: number | null;
}

const UNITS = ["g", "kg", "ml", "L", "each", "tbsp", "tsp", "cup"];

const emptyRow = (id: number): RecipeRow => ({
  id,
  name: "",
  qty: null,
  unit: "g",
});

export default function RecipeScalerPage() {
  const [rows, setRows] = useState<RecipeRow[]>([emptyRow(1), emptyRow(2)]);
  const [nextId, setNextId] = useState(3);
  const [originalYield, setOriginalYield] = useState<number | null>(4);
  const [targetYield, setTargetYield] = useState<number | null>(10);

  const factor =
    originalYield && targetYield && originalYield > 0
      ? targetYield / originalYield
      : null;

  const updateRow = (id: number, patch: Partial<RecipeRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const scaled = (qty: number | null) => {
    if (qty === null || factor === null) return "—";
    const value = qty * factor;
    return value % 1 === 0 ? String(value) : value.toFixed(2);
  };

  return (
    <ToolPageShell
      category="Kitchen Ops"
      title="Recipe Scaler"
      description="Enter your recipe as written, set the yield it makes and the yield you need, and every quantity is converted for you."
    >
      <SavedEntriesBar<SavedState>
        slug="recipe-scaler"
        getData={() => ({ rows, originalYield, targetYield })}
        onLoad={(entry) => {
          setRows(entry.data.rows);
          setOriginalYield(entry.data.originalYield);
          setTargetYield(entry.data.targetYield);
          setNextId(Math.max(0, ...entry.data.rows.map((r) => r.id)) + 1);
        }}
      />
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-6 border-b border-sand pb-6">
          <div>
            <p className="brand-label mb-2 text-[11px] text-ink/50">
              Recipe makes (serves)
            </p>
            <InputNumber
              className="!w-36"
              min={0.25}
              value={originalYield}
              onChange={setOriginalYield}
            />
          </div>
          <div>
            <p className="brand-label mb-2 text-[11px] text-ink/50">
              I need (serves)
            </p>
            <InputNumber
              className="!w-36"
              min={0.25}
              value={targetYield}
              onChange={setTargetYield}
            />
          </div>
          {factor !== null && (
            <p className="pb-2 text-sm text-ink/60">
              Scaling factor:{" "}
              <span className="font-medium text-maroon">
                ×{factor.toFixed(2)}
              </span>
            </p>
          )}
        </div>

        <div className="hidden grid-cols-[1fr_120px_110px_120px_40px] gap-3 md:grid">
          {["Ingredient", "Quantity", "Unit", "Scaled", ""].map((h) => (
            <span key={h} className="brand-label text-[11px] text-ink/50">
              {h}
            </span>
          ))}
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-2 gap-3 border-b border-sand pb-4 md:grid-cols-[1fr_120px_110px_120px_40px] md:border-none md:pb-0"
          >
            <Input
              className="col-span-2 md:col-span-1"
              placeholder="e.g. Plain flour"
              value={row.name}
              onChange={(e) => updateRow(row.id, { name: e.target.value })}
            />
            <InputNumber
              className="!w-full"
              placeholder="Qty"
              min={0}
              value={row.qty}
              onChange={(v) => updateRow(row.id, { qty: v })}
            />
            <Select
              value={row.unit}
              options={UNITS.map((u) => ({ value: u, label: u }))}
              onChange={(v) => updateRow(row.id, { unit: v })}
            />
            <div className="flex items-center justify-center border border-sand bg-cream px-3 font-medium text-maroon">
              {scaled(row.qty)} {row.qty !== null && factor !== null ? row.unit : ""}
            </div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={rows.length <= 1}
              onClick={() =>
                setRows((prev) => prev.filter((r) => r.id !== row.id))
              }
            />
          </div>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => {
            setRows((prev) => [...prev, emptyRow(nextId)]);
            setNextId((n) => n + 1);
          }}
          block
        >
          Add ingredient
        </Button>
      </div>
    </ToolPageShell>
  );
}
