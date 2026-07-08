import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber } from "antd";
import SavedEntriesBar from "../../components/SavedEntriesBar";
import ToolPageShell from "../../components/ToolPageShell";
import { aud } from "../../utils/format";

interface WastageRow {
  id: number;
  date: string;
  item: string;
  reason: string;
  people: string;
  supervisor: string;
  cost: number | null;
}

interface SavedState {
  rows: WastageRow[];
}

const emptyRow = (id: number): WastageRow => ({
  id,
  date: "",
  item: "",
  reason: "",
  people: "",
  supervisor: "",
  cost: null,
});

export default function WastageChartPage() {
  const [rows, setRows] = useState<WastageRow[]>([emptyRow(1)]);
  const [nextId, setNextId] = useState(2);

  const updateRow = (id: number, patch: Partial<WastageRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const totalCost = rows.reduce((s, r) => s + (r.cost ?? 0), 0);

  return (
    <ToolPageShell
      category="Yield & Waste"
      title="Wastage Chart"
      description="Record every food item thrown away: when, what, why, who was involved and what it cost. Save a chart per week and review it with the team — as a training tool and fact-finder, never to discipline staff, or they'll stop filling it in."
    >
      <SavedEntriesBar<SavedState>
        slug="wastage-chart"
        getData={() => ({ rows })}
        onLoad={(entry) => {
          setRows(entry.data.rows);
          setNextId(Math.max(0, ...entry.data.rows.map((r) => r.id)) + 1);
        }}
      />

      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-3">
          <div className="grid grid-cols-[130px_1fr_1.4fr_120px_120px_110px_40px] gap-3">
            {[
              "Date",
              "Item wasted",
              "Reason",
              "People involved",
              "Supervisor",
              "Total cost",
              "",
            ].map((h) => (
              <span key={h} className="brand-label text-[11px] text-ink/50">
                {h}
              </span>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[130px_1fr_1.4fr_120px_120px_110px_40px] gap-3"
            >
              <Input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(row.id, { date: e.target.value })}
              />
              <Input
                placeholder="What was wasted"
                value={row.item}
                onChange={(e) => updateRow(row.id, { item: e.target.value })}
              />
              <Input
                placeholder="Why did it happen? Could we have caught it earlier?"
                value={row.reason}
                onChange={(e) => updateRow(row.id, { reason: e.target.value })}
              />
              <Input
                placeholder="Who"
                value={row.people}
                onChange={(e) => updateRow(row.id, { people: e.target.value })}
              />
              <Input
                placeholder="Sign-off"
                value={row.supervisor}
                onChange={(e) =>
                  updateRow(row.id, { supervisor: e.target.value })
                }
              />
              <InputNumber
                className="!w-full"
                prefix="$"
                min={0}
                value={row.cost}
                onChange={(v) => updateRow(row.id, { cost: v })}
              />
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
        Add wastage record
      </Button>

      <div className="mt-8 flex items-baseline justify-between border border-sand bg-cream px-6 py-5">
        <span className="brand-label text-[11px] text-ink/50">
          Total cost of wastage
        </span>
        <span className="text-3xl font-medium text-maroon">
          {aud(totalCost)}
        </span>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/50">
        Stopping wastage: monitor what goes into the bin, keep accurate
        standard recipes, order only what's required, rotate stock, use up
        leftovers, and make sure what you're throwing away is actually waste.
      </p>
    </ToolPageShell>
  );
}
