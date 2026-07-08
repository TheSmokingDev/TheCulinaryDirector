import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Select } from "antd";
import SavedEntriesBar from "../../components/SavedEntriesBar";
import ToolPageShell from "../../components/ToolPageShell";
import { aud, pct } from "../../utils/format";

const GST = 1.1;

/** Grams (or ml) per unit; "each" is a count. */
const UNITS: Record<string, { factor: number; costLabel: string }> = {
  kg: { factor: 1000, costLabel: "$/kg" },
  g: { factor: 1, costLabel: "$/kg" },
  L: { factor: 1000, costLabel: "$/L" },
  ml: { factor: 1, costLabel: "$/L" },
  tsp: { factor: 5, costLabel: "$/kg" },
  tbsp: { factor: 15, costLabel: "$/kg" },
  cup: { factor: 250, costLabel: "$/kg" },
  each: { factor: 1, costLabel: "$/each" },
};

interface IngredientRow {
  id: number;
  name: string;
  qty: number | null;
  unit: string;
  wastagePct: number | null;
  costPerUnit: number | null;
}

interface SavedState {
  recipeName: string;
  section: string;
  date: string;
  portions: number | null;
  portionSize: number | null;
  rows: IngredientRow[];
  menuPrice: number | null;
  labourRate: number | null;
  labourMinutes: number | null;
  customFcPct: number | null;
}

const emptyRow = (id: number): IngredientRow => ({
  id,
  name: "",
  qty: null,
  unit: "g",
  wastagePct: null,
  costPerUnit: null,
});

function lineCost(row: IngredientRow): number | null {
  if (row.qty === null || row.costPerUnit === null) return null;
  const useable = 1 - (row.wastagePct ?? 0) / 100;
  if (useable <= 0) return null;
  const { factor } = UNITS[row.unit] ?? UNITS.g;
  if (row.unit === "each") return (row.qty / useable) * row.costPerUnit;
  const purchaseBase = (row.qty * factor) / useable; // grams or ml to buy
  return (purchaseBase / 1000) * row.costPerUnit;
}

function purchaseQty(row: IngredientRow): string | null {
  if (row.qty === null) return null;
  const useable = 1 - (row.wastagePct ?? 0) / 100;
  if (useable <= 0) return null;
  const q = row.qty / useable;
  return `${q % 1 === 0 ? q : q.toFixed(2)} ${row.unit}`;
}

const TARGET_FC = [25, 27, 30, 33];

export default function RecipeCostSheetPage() {
  const [recipeName, setRecipeName] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState("");
  const [portions, setPortions] = useState<number | null>(null);
  const [portionSize, setPortionSize] = useState<number | null>(null);
  const [rows, setRows] = useState<IngredientRow[]>([emptyRow(1), emptyRow(2)]);
  const [nextId, setNextId] = useState(3);
  const [menuPrice, setMenuPrice] = useState<number | null>(null);
  const [labourRate, setLabourRate] = useState<number | null>(null);
  const [labourMinutes, setLabourMinutes] = useState<number | null>(null);
  const [customFcPct, setCustomFcPct] = useState<number | null>(null);

  const updateRow = (id: number, patch: Partial<IngredientRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const totalCost = rows.reduce((s, r) => s + (lineCost(r) ?? 0), 0);
  const costPerPortion =
    portions && portions > 0 ? totalCost / portions : null;

  const revenue = menuPrice !== null ? menuPrice / GST : null;
  const gst = menuPrice !== null && revenue !== null ? menuPrice - revenue : null;
  const fcPct =
    costPerPortion !== null && revenue && revenue > 0
      ? (costPerPortion / revenue) * 100
      : null;
  const gpDollars =
    costPerPortion !== null && revenue !== null ? revenue - costPerPortion : null;

  const labourCost =
    labourRate !== null && labourMinutes !== null
      ? labourRate * (labourMinutes / 60)
      : null;
  const labourPerPortion =
    labourCost !== null && portions && portions > 0
      ? labourCost / portions
      : null;
  const costWithLabour =
    costPerPortion !== null && labourPerPortion !== null
      ? costPerPortion + labourPerPortion
      : null;
  const fcWithLabourPct =
    costWithLabour !== null && revenue && revenue > 0
      ? (costWithLabour / revenue) * 100
      : null;
  const cmWithLabour =
    costWithLabour !== null && revenue !== null ? revenue - costWithLabour : null;

  const targetPrice = (target: number) =>
    costPerPortion !== null && target > 0
      ? (costPerPortion / (target / 100)) * GST
      : null;

  const statBlock = (
    stats: { label: string; value: string | null; warn?: boolean }[],
  ) => (
    <div
      className="grid gap-px border border-sand bg-sand"
      style={{
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
      }}
    >
      {stats.map((s) => (
        <div key={s.label} className="bg-cream p-5 text-center">
          <p className="brand-label mb-2 text-[11px] text-ink/50">{s.label}</p>
          <p
            className={`text-2xl font-medium ${s.warn ? "text-maroon" : "text-ink"}`}
          >
            {s.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <ToolPageShell
      category="Costing"
      title="Recipe Cost Sheet"
      description="The full recipe card. Cost every ingredient with its wastage percentage, set your portions and menu price, add labour, and get suggested selling prices for your target food cost percentages."
    >
      <SavedEntriesBar<SavedState>
        slug="recipe-cost-sheet"
        getData={() => ({
          recipeName,
          section,
          date,
          portions,
          portionSize,
          rows,
          menuPrice,
          labourRate,
          labourMinutes,
          customFcPct,
        })}
        onLoad={({ data }) => {
          setRecipeName(data.recipeName);
          setSection(data.section);
          setDate(data.date);
          setPortions(data.portions);
          setPortionSize(data.portionSize);
          setRows(data.rows);
          setMenuPrice(data.menuPrice);
          setLabourRate(data.labourRate);
          setLabourMinutes(data.labourMinutes);
          setCustomFcPct(data.customFcPct);
          setNextId(Math.max(0, ...data.rows.map((r) => r.id)) + 1);
        }}
      />

      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Name of recipe",
            el: (
              <Input
                placeholder="e.g. Herb-crusted lamb rack"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            ),
            span: "lg:col-span-2",
          },
          {
            label: "Section",
            el: (
              <Input
                placeholder="e.g. Mains"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            ),
          },
          {
            label: "Date",
            el: (
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            ),
          },
          {
            label: "Number of portions",
            el: (
              <InputNumber
                className="!w-full"
                min={1}
                value={portions}
                onChange={setPortions}
              />
            ),
          },
        ].map((f) => (
          <div key={f.label} className={f.span ?? ""}>
            <p className="brand-label mb-2 text-[11px] text-ink/50">{f.label}</p>
            {f.el}
          </div>
        ))}
        <div>
          <p className="brand-label mb-2 text-[11px] text-ink/50">
            Portion size (g)
          </p>
          <InputNumber
            className="!w-full"
            min={0}
            value={portionSize}
            onChange={setPortionSize}
          />
        </div>
      </div>

      <h3 className="brand-label mb-4 mt-10 text-xs text-maroon">
        Ingredients
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[880px] space-y-3">
          <div className="grid grid-cols-[1fr_100px_90px_100px_110px_110px_110px_40px] gap-3">
            {[
              "Ingredient",
              "Quantity",
              "Unit",
              "Wastage %",
              "Cost per unit",
              "Purchase qty",
              "Cost",
              "",
            ].map((h) => (
              <span key={h} className="brand-label text-[11px] text-ink/50">
                {h}
              </span>
            ))}
          </div>

          {rows.map((row) => {
            const cost = lineCost(row);
            return (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_100px_90px_100px_110px_110px_110px_40px] items-center gap-3"
              >
                <Input
                  placeholder="e.g. Rack of lamb"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, { name: e.target.value })}
                />
                <InputNumber
                  className="!w-full"
                  min={0}
                  value={row.qty}
                  onChange={(v) => updateRow(row.id, { qty: v })}
                />
                <Select
                  value={row.unit}
                  options={Object.keys(UNITS).map((u) => ({
                    value: u,
                    label: u,
                  }))}
                  onChange={(v) => updateRow(row.id, { unit: v })}
                />
                <InputNumber
                  className="!w-full"
                  min={0}
                  max={99}
                  value={row.wastagePct}
                  onChange={(v) => updateRow(row.id, { wastagePct: v })}
                />
                <InputNumber
                  className="!w-full"
                  prefix="$"
                  min={0}
                  placeholder={UNITS[row.unit]?.costLabel}
                  value={row.costPerUnit}
                  onChange={(v) => updateRow(row.id, { costPerUnit: v })}
                />
                <span className="text-center text-sm text-ink/60">
                  {purchaseQty(row) ?? "—"}
                </span>
                <span className="text-center text-sm font-medium">
                  {cost === null ? "—" : aud(cost)}
                </span>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  disabled={rows.length <= 1}
                  onClick={() =>
                    setRows((prev) => prev.filter((r) => r.id !== row.id))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        className="!mt-3"
        block
        onClick={() => {
          setRows((prev) => [...prev, emptyRow(nextId)]);
          setNextId((x) => x + 1);
        }}
      >
        Add ingredient
      </Button>

      <div className="mt-8">
        {statBlock([
          { label: "Total cost", value: aud(totalCost) },
          {
            label: "Cost per portion",
            value: costPerPortion === null ? null : aud(costPerPortion),
          },
        ])}
      </div>

      <h3 className="brand-label mb-4 mt-10 text-xs text-maroon">
        Pricing &amp; labour
      </h3>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
        {[
          {
            label: "Menu selling price (inc GST)",
            value: menuPrice,
            set: setMenuPrice,
            prefix: "$",
          },
          {
            label: "Labour per hour",
            value: labourRate,
            set: setLabourRate,
            prefix: "$",
          },
          {
            label: "Time taken (minutes)",
            value: labourMinutes,
            set: setLabourMinutes,
            prefix: undefined,
          },
        ].map((f) => (
          <div key={f.label}>
            <p className="brand-label mb-2 text-[11px] text-ink/50">{f.label}</p>
            <InputNumber
              className="!w-full"
              prefix={f.prefix}
              min={0}
              value={f.value}
              onChange={f.set}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        {statBlock([
          {
            label: "Food cost %",
            value: fcPct === null ? null : pct(fcPct),
            warn: fcPct !== null && fcPct > 35,
          },
          {
            label: "Gross profit / portion",
            value: gpDollars === null ? null : aud(gpDollars),
          },
          {
            label: "Food cost with labour %",
            value: fcWithLabourPct === null ? null : pct(fcWithLabourPct),
          },
          {
            label: "Contribution margin with labour",
            value: cmWithLabour === null ? null : aud(cmWithLabour),
          },
        ])}
      </div>

      <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {[
          {
            label: "Kitchen revenue (ex GST)",
            value: revenue === null ? null : aud(revenue),
          },
          { label: "Less G.S.T.", value: gst === null ? null : aud(gst) },
          {
            label: "Labour cost (whole recipe)",
            value: labourCost === null ? null : aud(labourCost),
          },
          {
            label: "Cost per portion with labour",
            value: costWithLabour === null ? null : aud(costWithLabour),
          },
        ].map((o) => (
          <div
            key={o.label}
            className="flex items-baseline justify-between border-b border-sand py-3"
          >
            <span className="text-sm text-ink/70">{o.label}</span>
            <span className="font-medium">{o.value ?? "—"}</span>
          </div>
        ))}
      </div>

      <h3 className="brand-label mb-4 mt-10 text-xs text-maroon">
        Desired selling price
      </h3>
      <div className="grid gap-x-8 sm:grid-cols-2">
        {TARGET_FC.map((t) => (
          <div
            key={t}
            className="flex items-baseline justify-between border-b border-sand py-3"
          >
            <span className="text-sm text-ink/70">
              Selling price for a {t}% food cost
            </span>
            <span className="font-medium">
              {targetPrice(t) === null ? "—" : `${aud(targetPrice(t)!)} inc GST`}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-b border-sand py-3 sm:col-span-2">
          <span className="flex items-center gap-3 text-sm text-ink/70">
            Selling price for a
            <InputNumber
              className="!w-24"
              min={1}
              max={99}
              value={customFcPct}
              onChange={setCustomFcPct}
            />
            % food cost
          </span>
          <span className="font-medium text-maroon">
            {customFcPct && targetPrice(customFcPct) !== null
              ? `${aud(targetPrice(customFcPct)!)} inc GST`
              : "—"}
          </span>
        </div>
      </div>
    </ToolPageShell>
  );
}
