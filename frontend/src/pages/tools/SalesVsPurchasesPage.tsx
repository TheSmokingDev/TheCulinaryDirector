import { useState } from "react";
import { InputNumber } from "antd";
import SavedEntriesBar from "../../components/SavedEntriesBar";
import ToolPageShell from "../../components/ToolPageShell";
import { aud, pct } from "../../utils/format";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type DayValues = (number | null)[];

interface SavedState {
  purchases: DayValues;
  sales: DayValues;
}

const emptyWeek = (): DayValues => Array(7).fill(null);

export default function SalesVsPurchasesPage() {
  const [purchases, setPurchases] = useState<DayValues>(emptyWeek());
  const [sales, setSales] = useState<DayValues>(emptyWeek());

  const setDay = (
    setter: typeof setPurchases,
    idx: number,
    value: number | null,
  ) =>
    setter((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });

  const dayFc = (i: number) => {
    const p = purchases[i];
    const s = sales[i];
    return p !== null && s && s > 0 ? (p / s) * 100 : null;
  };

  const totalPurchases = purchases.reduce((s: number, v) => s + (v ?? 0), 0);
  const totalSales = sales.reduce((s: number, v) => s + (v ?? 0), 0);
  const weekFc = totalSales > 0 ? (totalPurchases / totalSales) * 100 : null;

  return (
    <ToolPageShell
      category="Spend & Period"
      title="Sales vs Purchases"
      description="A quick daily pulse on food cost: enter each day's purchases and sales for the week and watch the daily and running food cost percentage. It's rough — stock movements aren't counted — but it catches a bad week early."
    >
      <SavedEntriesBar<SavedState>
        slug="sales-vs-purchases"
        getData={() => ({ purchases, sales })}
        onLoad={(entry) => {
          setPurchases(entry.data.purchases);
          setSales(entry.data.sales);
        }}
      />

      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-[110px_repeat(7,1fr)] gap-2">
            <span />
            {DAYS.map((d) => (
              <span
                key={d}
                className="brand-label text-center text-[11px] text-ink/50"
              >
                {d.slice(0, 3)}
              </span>
            ))}

            <span className="brand-label self-center text-[11px] text-ink/50">
              Purchases
            </span>
            {DAYS.map((d, i) => (
              <InputNumber
                key={d}
                className="!w-full"
                min={0}
                controls={false}
                value={purchases[i]}
                onChange={(v) => setDay(setPurchases, i, v)}
              />
            ))}

            <span className="brand-label self-center text-[11px] text-ink/50">
              Sales
            </span>
            {DAYS.map((d, i) => (
              <InputNumber
                key={d}
                className="!w-full"
                min={0}
                controls={false}
                value={sales[i]}
                onChange={(v) => setDay(setSales, i, v)}
              />
            ))}

            <span className="brand-label self-center text-[11px] text-ink/50">
              Food cost %
            </span>
            {DAYS.map((d, i) => {
              const fc = dayFc(i);
              return (
                <div
                  key={d}
                  className={`flex h-[42px] items-center justify-center border border-sand bg-cream text-sm font-medium ${
                    fc !== null && fc > 35 ? "text-maroon" : "text-ink"
                  }`}
                >
                  {fc === null ? "—" : pct(fc, 0)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-px border border-sand bg-sand sm:grid-cols-3">
        {[
          { label: "Purchases this week", value: aud(totalPurchases) },
          { label: "Sales this week", value: aud(totalSales) },
          {
            label: "Food cost % this week",
            value: weekFc === null ? "—" : pct(weekFc),
            warn: weekFc !== null && weekFc > 35,
          },
        ].map((s) => (
          <div key={s.label} className="bg-cream p-6 text-center">
            <p className="brand-label mb-2 text-[11px] text-ink/50">{s.label}</p>
            <p
              className={`text-3xl font-medium ${s.warn ? "text-maroon" : "text-ink"}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </ToolPageShell>
  );
}
