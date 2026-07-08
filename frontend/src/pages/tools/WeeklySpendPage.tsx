import { useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber } from "antd";
import SavedEntriesBar from "../../components/SavedEntriesBar";
import ToolPageShell from "../../components/ToolPageShell";
import { aud, pct } from "../../utils/format";

const GST = 1.1;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const PERIODS = ["Breakfast", "Lunch", "Dinner", "Other"] as const;

type Week = (number | null)[];

interface SupplierRow {
  id: number;
  name: string;
  days: Week;
}

interface PeriodData {
  customers: Week;
  sales: Week;
}

interface SavedState {
  weekBeginning: string;
  suppliers: SupplierRow[];
  periods: Record<string, PeriodData>;
}

const emptyWeek = (): Week => Array(7).fill(null);
const emptySupplier = (id: number): SupplierRow => ({
  id,
  name: "",
  days: emptyWeek(),
});
const emptyPeriods = (): Record<string, PeriodData> =>
  Object.fromEntries(
    PERIODS.map((p) => [p, { customers: emptyWeek(), sales: emptyWeek() }]),
  );

const sum = (w: Week) => w.reduce((s: number, v) => s + (v ?? 0), 0);

export default function WeeklySpendPage() {
  const [weekBeginning, setWeekBeginning] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([
    emptySupplier(1),
    emptySupplier(2),
  ]);
  const [nextId, setNextId] = useState(3);
  const [periods, setPeriods] = useState<Record<string, PeriodData>>(
    emptyPeriods(),
  );

  const setSupplierDay = (id: number, day: number, value: number | null) =>
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, days: s.days.map((v, i) => (i === day ? value : v)) }
          : s,
      ),
    );

  const setPeriodValue = (
    period: string,
    field: keyof PeriodData,
    day: number,
    value: number | null,
  ) =>
    setPeriods((prev) => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: prev[period][field].map((v, i) => (i === day ? value : v)),
      },
    }));

  const daySpend = (i: number) =>
    suppliers.reduce((s, r) => s + (r.days[i] ?? 0), 0);
  const totalSpend = suppliers.reduce((s, r) => s + sum(r.days), 0);

  const totalSales = PERIODS.reduce((s, p) => s + sum(periods[p].sales), 0);
  const totalCustomers = PERIODS.reduce(
    (s, p) => s + sum(periods[p].customers),
    0,
  );
  const totalKitchenRevenue = totalSales / GST;
  const expectedFc =
    totalKitchenRevenue > 0 ? (totalSpend / totalKitchenRevenue) * 100 : null;

  return (
    <ToolPageShell
      category="Spend & Period"
      title="Weekly Spend"
      description="Log what you spend with each supplier day by day, and what each meal period brings in. The week's totals give you average spend per customer, your turnover mix, and the food cost percentage you should expect before a stocktake."
    >
      <SavedEntriesBar<SavedState>
        slug="weekly-spend"
        getData={() => ({ weekBeginning, suppliers, periods })}
        onLoad={(entry) => {
          setWeekBeginning(entry.data.weekBeginning);
          setSuppliers(entry.data.suppliers);
          setPeriods(entry.data.periods);
          setNextId(Math.max(0, ...entry.data.suppliers.map((s) => s.id)) + 1);
        }}
      />

      <div className="mb-8 max-w-56">
        <p className="brand-label mb-2 text-[11px] text-ink/50">
          Week beginning
        </p>
        <Input
          type="date"
          value={weekBeginning}
          onChange={(e) => setWeekBeginning(e.target.value)}
        />
      </div>

      <h3 className="brand-label mb-4 text-xs text-maroon">
        Weekly expenditure
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-2">
          <div className="grid grid-cols-[170px_repeat(7,1fr)_90px_36px] gap-2">
            <span className="brand-label text-[11px] text-ink/50">
              Supplier
            </span>
            {DAYS.map((d) => (
              <span
                key={d}
                className="brand-label text-center text-[11px] text-ink/50"
              >
                {d}
              </span>
            ))}
            <span className="brand-label text-center text-[11px] text-ink/50">
              Total
            </span>
            <span />
          </div>

          {suppliers.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[170px_repeat(7,1fr)_90px_36px] items-center gap-2"
            >
              <Input
                placeholder="Supplier"
                value={row.name}
                onChange={(e) =>
                  setSuppliers((prev) =>
                    prev.map((s) =>
                      s.id === row.id ? { ...s, name: e.target.value } : s,
                    ),
                  )
                }
              />
              {DAYS.map((d, i) => (
                <InputNumber
                  key={d}
                  className="!w-full"
                  min={0}
                  controls={false}
                  value={row.days[i]}
                  onChange={(v) => setSupplierDay(row.id, i, v)}
                />
              ))}
              <span className="text-center text-sm font-medium">
                {aud(sum(row.days))}
              </span>
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                disabled={suppliers.length <= 1}
                onClick={() =>
                  setSuppliers((prev) => prev.filter((s) => s.id !== row.id))
                }
              />
            </div>
          ))}

          <div className="grid grid-cols-[170px_repeat(7,1fr)_90px_36px] items-center gap-2 border-t border-sand pt-2">
            <span className="brand-label text-[11px] text-ink/50">Total</span>
            {DAYS.map((d, i) => (
              <span key={d} className="text-center text-sm font-medium">
                {aud(daySpend(i))}
              </span>
            ))}
            <span className="text-center text-sm font-semibold text-maroon">
              {aud(totalSpend)}
            </span>
            <span />
          </div>
        </div>
      </div>

      <Button
        type="dashed"
        icon={<PlusOutlined />}
        className="!mt-3"
        block
        onClick={() => {
          setSuppliers((prev) => [...prev, emptySupplier(nextId)]);
          setNextId((x) => x + 1);
        }}
      >
        Add supplier
      </Button>

      <h3 className="brand-label mb-4 mt-10 text-xs text-maroon">
        Weekly revenue
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-4">
          {PERIODS.map((period) => {
            const data = periods[period];
            const periodSales = sum(data.sales);
            const periodCustomers = sum(data.customers);
            return (
              <div key={period}>
                <p className="mb-2 text-sm font-medium">{period}</p>
                {(["customers", "sales"] as const).map((field) => (
                  <div
                    key={field}
                    className="mb-1 grid grid-cols-[170px_repeat(7,1fr)_90px_36px] items-center gap-2"
                  >
                    <span className="brand-label text-[11px] text-ink/50">
                      {field}
                    </span>
                    {DAYS.map((d, i) => (
                      <InputNumber
                        key={d}
                        className="!w-full"
                        min={0}
                        controls={false}
                        value={data[field][i]}
                        onChange={(v) => setPeriodValue(period, field, i, v)}
                      />
                    ))}
                    <span className="text-center text-sm font-medium">
                      {field === "sales"
                        ? aud(periodSales)
                        : periodCustomers || "—"}
                    </span>
                    <span />
                  </div>
                ))}
                <div className="grid grid-cols-[170px_repeat(7,1fr)_90px_36px] items-center gap-2">
                  <span className="brand-label text-[11px] text-ink/50">
                    Avg sale / customer
                  </span>
                  {DAYS.map((d, i) => {
                    const c = data.customers[i];
                    const s = data.sales[i];
                    return (
                      <span key={d} className="text-center text-xs text-ink/60">
                        {c && s !== null ? aud((s ?? 0) / c) : "—"}
                      </span>
                    );
                  })}
                  <span className="text-center text-xs text-ink/60">
                    {periodCustomers > 0
                      ? aud(periodSales / periodCustomers)
                      : "—"}
                  </span>
                  <span />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="brand-label mb-4 mt-10 text-xs text-maroon">
        Weekly summary
      </h3>
      <div className="grid gap-px border border-sand bg-sand sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total spend", value: aud(totalSpend) },
          {
            label: "Kitchen revenue (ex GST)",
            value: aud(totalKitchenRevenue),
          },
          {
            label: "Avg sale / customer",
            value: totalCustomers > 0 ? aud(totalSales / totalCustomers) : "—",
          },
          {
            label: "Expected food cost %",
            value: expectedFc === null ? "—" : pct(expectedFc),
            warn: expectedFc !== null && expectedFc > 35,
          },
        ].map((s) => (
          <div key={s.label} className="bg-cream p-6 text-center">
            <p className="brand-label mb-2 text-[11px] text-ink/50">{s.label}</p>
            <p
              className={`text-2xl font-medium ${s.warn ? "text-maroon" : "text-ink"}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
        {PERIODS.map((p) => {
          const share =
            totalSales > 0 ? (sum(periods[p].sales) / totalSales) * 100 : null;
          return (
            <div
              key={p}
              className="flex items-baseline justify-between border-b border-sand py-3"
            >
              <span className="text-sm text-ink/70">Turnover % — {p}</span>
              <span className="font-medium">
                {share === null ? "—" : pct(share)}
              </span>
            </div>
          );
        })}
      </div>
    </ToolPageShell>
  );
}
