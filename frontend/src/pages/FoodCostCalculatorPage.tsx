import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber } from "antd";
import BrandButton from "../components/BrandButton";
import SavedEntriesBar from "../components/SavedEntriesBar";
import ToolPageShell from "../components/ToolPageShell";

interface IngredientRow {
  id: number;
  name: string;
  packCost: number | null;
  packSize: number | null;
  qtyUsed: number | null;
}

interface SavedState {
  rows: IngredientRow[];
  menuPrice: number | null;
}

const emptyRow = (id: number): IngredientRow => ({
  id,
  name: "",
  packCost: null,
  packSize: null,
  qtyUsed: null,
});

function lineCost(row: IngredientRow): number {
  if (!row.packCost || !row.packSize || !row.qtyUsed) return 0;
  return (row.packCost / row.packSize) * row.qtyUsed;
}

const aud = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });

export default function FoodCostCalculatorPage() {
  const [rows, setRows] = useState<IngredientRow[]>([emptyRow(1), emptyRow(2)]);
  const [nextId, setNextId] = useState(3);
  const [menuPrice, setMenuPrice] = useState<number | null>(null);

  const updateRow = (id: number, patch: Partial<IngredientRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow(nextId)]);
    setNextId((n) => n + 1);
  };

  const removeRow = (id: number) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const plateCost = rows.reduce((sum, r) => sum + lineCost(r), 0);
  const priceExGst = menuPrice ? menuPrice / 1.1 : 0;
  const foodCostPct = priceExGst > 0 ? (plateCost / priceExGst) * 100 : null;
  const grossProfit = priceExGst > 0 ? priceExGst - plateCost : null;

  return (
    <ToolPageShell
      category="Costing"
      title="Food Cost Calculator"
      description="Enter each ingredient with the cost and size of the pack you buy it in, plus the quantity used in the dish. Then add your menu price (inc GST) to see your food cost percentage and gross profit."
    >
      <SavedEntriesBar<SavedState>
        slug="food-cost-calculator"
        getData={() => ({ rows, menuPrice })}
        onLoad={(entry) => {
          setRows(entry.data.rows);
          setMenuPrice(entry.data.menuPrice);
          setNextId(Math.max(0, ...entry.data.rows.map((r) => r.id)) + 1);
        }}
      />
      <div className="space-y-4">
        <div className="hidden grid-cols-[1fr_130px_130px_130px_40px] gap-3 md:grid">
          {["Ingredient", "Pack cost ($)", "Pack size", "Qty used", ""].map(
            (h) => (
              <span key={h} className="brand-label text-[11px] text-ink/50">
                {h}
              </span>
            ),
          )}
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-2 gap-3 border-b border-sand pb-4 md:grid-cols-[1fr_130px_130px_130px_40px] md:border-none md:pb-0"
          >
            <Input
              className="col-span-2 md:col-span-1"
              placeholder="e.g. Chicken breast"
              value={row.name}
              onChange={(e) => updateRow(row.id, { name: e.target.value })}
            />
            <InputNumber
              className="!w-full"
              placeholder="Cost"
              min={0}
              value={row.packCost}
              onChange={(v) => updateRow(row.id, { packCost: v })}
            />
            <InputNumber
              className="!w-full"
              placeholder="e.g. 1000 g"
              min={0}
              value={row.packSize}
              onChange={(v) => updateRow(row.id, { packSize: v })}
            />
            <InputNumber
              className="!w-full"
              placeholder="e.g. 180 g"
              min={0}
              value={row.qtyUsed}
              onChange={(v) => updateRow(row.id, { qtyUsed: v })}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={rows.length <= 1}
              onClick={() => removeRow(row.id)}
            />
          </div>
        ))}

        <Button type="dashed" icon={<PlusOutlined />} onClick={addRow} block>
          Add ingredient
        </Button>

        <div className="flex flex-wrap items-end justify-between gap-6 pt-6">
          <div>
            <p className="brand-label mb-2 text-[11px] text-ink/50">
              Menu price (inc GST)
            </p>
            <InputNumber
              className="!w-44"
              prefix="$"
              min={0}
              value={menuPrice}
              onChange={setMenuPrice}
            />
          </div>
          <BrandButton
            variantStyle="outline"
            onClick={() => {
              setRows([emptyRow(nextId), emptyRow(nextId + 1)]);
              setNextId((n) => n + 2);
              setMenuPrice(null);
            }}
          >
            Reset
          </BrandButton>
        </div>

        <div className="mt-4 grid gap-px border border-sand bg-sand sm:grid-cols-3">
          {[
            { label: "Plate cost", value: aud(plateCost) },
            {
              label: "Food cost %",
              value: foodCostPct === null ? "—" : `${foodCostPct.toFixed(1)}%`,
              warn: foodCostPct !== null && foodCostPct > 35,
            },
            {
              label: "Gross profit (ex GST)",
              value: grossProfit === null ? "—" : aud(grossProfit),
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-cream p-6 text-center">
              <p className="brand-label mb-2 text-[11px] text-ink/50">
                {stat.label}
              </p>
              <p
                className={`text-3xl font-medium ${
                  stat.warn ? "text-maroon" : "text-ink"
                }`}
              >
                {stat.value}
              </p>
              {stat.warn && (
                <p className="mt-1 text-xs text-maroon">
                  Above the 35% benchmark
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToolPageShell>
  );
}
