import { useState } from "react";
import { Input, InputNumber } from "antd";
import SavedEntriesBar from "./SavedEntriesBar";
import ToolPageShell from "./ToolPageShell";

export interface CalcField {
  key: string;
  label: string;
  type?: "number" | "text";
  unit?: string;
  prefix?: string;
  placeholder?: string;
}

export interface CalcOutput {
  label: string;
  value: string | null;
  /** Highlight as the headline result */
  emphasis?: boolean;
  warn?: boolean;
  hint?: string;
}

export type CalcValues = Record<string, number | string | null>;

export interface CalculatorConfig {
  slug: string;
  category: string;
  title: string;
  description: string;
  /** Plain-language formula shown above the inputs */
  formula?: string;
  fields: CalcField[];
  compute: (values: CalcValues) => CalcOutput[];
}

interface SavedState {
  values: CalcValues;
}

function numVal(v: number | string | null | undefined): number | null {
  return typeof v === "number" ? v : null;
}

/** Read a numeric field; returns null when missing so outputs show "—". */
export function n(values: CalcValues, key: string): number | null {
  return numVal(values[key]);
}

export default function CalculatorTool({
  config,
}: {
  config: CalculatorConfig;
}) {
  const [values, setValues] = useState<CalcValues>({});

  const set = (key: string, value: number | string | null) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const outputs = config.compute(values);
  const headline = outputs.filter((o) => o.emphasis);
  const rest = outputs.filter((o) => !o.emphasis);

  return (
    <ToolPageShell
      category={config.category}
      title={config.title}
      description={config.description}
    >
      <SavedEntriesBar<SavedState>
        slug={config.slug}
        getData={() => ({ values })}
        onLoad={(entry) => setValues(entry.data.values)}
      />

      {config.formula && (
        <p className="mb-8 border-l-2 border-maroon bg-cream px-4 py-3 text-sm italic text-ink/70">
          {config.formula}
        </p>
      )}

      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div key={field.key}>
            <p className="brand-label mb-2 text-[11px] text-ink/50">
              {field.label}
              {field.unit ? ` (${field.unit})` : ""}
            </p>
            {field.type === "text" ? (
              <Input
                placeholder={field.placeholder}
                value={(values[field.key] as string) ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
              />
            ) : (
              <InputNumber
                className="!w-full"
                prefix={field.prefix}
                placeholder={field.placeholder}
                value={numVal(values[field.key])}
                onChange={(v) => set(field.key, v)}
              />
            )}
          </div>
        ))}
      </div>

      {headline.length > 0 && (
        <div
          className="mt-10 grid gap-px border border-sand bg-sand"
          style={{
            gridTemplateColumns: `repeat(${Math.min(headline.length, 3)}, minmax(0, 1fr))`,
          }}
        >
          {headline.map((o) => (
            <div key={o.label} className="bg-cream p-6 text-center">
              <p className="brand-label mb-2 text-[11px] text-ink/50">
                {o.label}
              </p>
              <p
                className={`text-3xl font-medium ${o.warn ? "text-maroon" : "text-ink"}`}
              >
                {o.value ?? "—"}
              </p>
              {o.hint && <p className="mt-1 text-xs text-maroon">{o.hint}</p>}
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {rest.map((o) => (
            <div
              key={o.label}
              className="flex items-baseline justify-between border-b border-sand py-3"
            >
              <span className="text-sm text-ink/70">{o.label}</span>
              <span
                className={`font-medium ${o.warn ? "text-maroon" : "text-ink"}`}
              >
                {o.value ?? "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </ToolPageShell>
  );
}
