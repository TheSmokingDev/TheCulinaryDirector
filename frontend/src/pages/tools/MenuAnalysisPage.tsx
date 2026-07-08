import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Tag } from "antd";
import SavedEntriesBar from "../../components/SavedEntriesBar";
import ToolPageShell from "../../components/ToolPageShell";
import { aud, pct } from "../../utils/format";

const GST = 1.1;

interface MenuRow {
  id: number;
  name: string;
  sold: number | null;
  foodCost: number | null;
  menuPrice: number | null;
}

interface SavedState {
  rows: MenuRow[];
}

const emptyRow = (id: number): MenuRow => ({
  id,
  name: "",
  sold: null,
  foodCost: null,
  menuPrice: null,
});

const CLASS_COLOURS: Record<string, string> = {
  Star: "green",
  Plowhorse: "gold",
  Puzzle: "blue",
  Dog: "red",
};

export default function MenuAnalysisPage() {
  const [rows, setRows] = useState<MenuRow[]>([
    emptyRow(1),
    emptyRow(2),
    emptyRow(3),
  ]);
  const [nextId, setNextId] = useState(4);

  const updateRow = (id: number, patch: Partial<MenuRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const active = rows.filter(
    (r) => r.sold !== null && r.foodCost !== null && r.menuPrice !== null,
  );
  const totalSold = active.reduce((s, r) => s + (r.sold ?? 0), 0);
  const totals = active.reduce(
    (acc, r) => {
      const revenue = (r.menuPrice ?? 0) / GST;
      const cm = revenue - (r.foodCost ?? 0);
      acc.cost += (r.foodCost ?? 0) * (r.sold ?? 0);
      acc.revenue += revenue * (r.sold ?? 0);
      acc.cm += cm * (r.sold ?? 0);
      return acc;
    },
    { cost: 0, revenue: 0, cm: 0 },
  );
  // Popularity index: an item pulls its weight when it sells at least the
  // average share of the menu (100% / number of items on the menu).
  const popularityIndex = active.length > 0 ? 100 / active.length : null;
  const avgCM = totalSold > 0 ? totals.cm / totalSold : null;

  const analyse = (r: MenuRow) => {
    if (
      r.sold === null ||
      r.foodCost === null ||
      r.menuPrice === null ||
      totalSold === 0 ||
      popularityIndex === null ||
      avgCM === null
    )
      return null;
    const revenue = r.menuPrice / GST;
    const mmPct = (r.sold / totalSold) * 100;
    const fcPct = revenue > 0 ? (r.foodCost / revenue) * 100 : 0;
    const cm = revenue - r.foodCost;
    const mmHigh = mmPct >= popularityIndex;
    const cmHigh = cm >= avgCM;
    const cls = mmHigh
      ? cmHigh
        ? "Star"
        : "Plowhorse"
      : cmHigh
        ? "Puzzle"
        : "Dog";
    return { mmPct, fcPct, cm, cls };
  };

  return (
    <ToolPageShell
      category="Menu & Profit"
      title="Menu Analysis"
      description="Enter each menu item with the number sold over a period, its food cost and its menu price. Items are classed by popularity (menu mix) and contribution margin: Stars to protect, Plowhorses to re-price, Puzzles to promote, Dogs to retire."
    >
      <SavedEntriesBar<SavedState>
        slug="menu-analysis"
        getData={() => ({ rows })}
        onLoad={(entry) => {
          setRows(entry.data.rows);
          setNextId(Math.max(0, ...entry.data.rows.map((r) => r.id)) + 1);
        }}
      />

      <div className="overflow-x-auto">
        <div className="min-w-[820px] space-y-3">
          <div className="grid grid-cols-[1fr_90px_110px_110px_90px_90px_100px_110px_40px] gap-3">
            {[
              "Menu item",
              "Sold",
              "Food cost",
              "Menu price",
              "Mix %",
              "FC %",
              "Cont. margin",
              "Class",
              "",
            ].map((h) => (
              <span key={h} className="brand-label text-[11px] text-ink/50">
                {h}
              </span>
            ))}
          </div>

          {rows.map((row) => {
            const a = analyse(row);
            return (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_90px_110px_110px_90px_90px_100px_110px_40px] items-center gap-3"
              >
                <Input
                  placeholder="e.g. Soup of the day"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, { name: e.target.value })}
                />
                <InputNumber
                  className="!w-full"
                  min={0}
                  value={row.sold}
                  onChange={(v) => updateRow(row.id, { sold: v })}
                />
                <InputNumber
                  className="!w-full"
                  prefix="$"
                  min={0}
                  value={row.foodCost}
                  onChange={(v) => updateRow(row.id, { foodCost: v })}
                />
                <InputNumber
                  className="!w-full"
                  prefix="$"
                  min={0}
                  value={row.menuPrice}
                  onChange={(v) => updateRow(row.id, { menuPrice: v })}
                />
                <span className="text-sm">{a ? pct(a.mmPct) : "—"}</span>
                <span
                  className={`text-sm ${a && a.fcPct > 35 ? "font-medium text-maroon" : ""}`}
                >
                  {a ? pct(a.fcPct) : "—"}
                </span>
                <span className="text-sm">{a ? aud(a.cm) : "—"}</span>
                <span>
                  {a ? (
                    <Tag color={CLASS_COLOURS[a.cls]} className="!m-0">
                      {a.cls}
                    </Tag>
                  ) : (
                    "—"
                  )}
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
        className="!mt-4"
        block
        onClick={() => {
          setRows((prev) => [...prev, emptyRow(nextId)]);
          setNextId((x) => x + 1);
        }}
      >
        Add menu item
      </Button>

      <div className="mt-8 grid gap-px border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total items sold", value: totalSold || "—" },
          {
            label: "Popularity index",
            value: popularityIndex === null ? "—" : pct(popularityIndex),
          },
          {
            label: "Average contribution margin",
            value: avgCM === null ? "—" : aud(avgCM),
          },
          {
            label: "Total menu contribution",
            value: active.length ? aud(totals.cm) : "—",
          },
        ].map((s) => (
          <div key={s.label} className="bg-cream p-6 text-center">
            <p className="brand-label mb-2 text-[11px] text-ink/50">{s.label}</p>
            <p className="text-2xl font-medium text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/50">
        Class key — <strong>Star</strong>: high mix, high margin (protect and
        feature it). <strong>Plowhorse</strong>: popular but low margin
        (re-cost or re-price). <strong>Puzzle</strong>: high margin but slow
        (promote, reposition on the menu). <strong>Dog</strong>: low mix, low
        margin (replace it).
      </p>
    </ToolPageShell>
  );
}
