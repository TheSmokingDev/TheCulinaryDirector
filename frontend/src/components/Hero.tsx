import type { ReactNode } from "react";

export interface HeroProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

export default function Hero({ title, subtitle, actions }: HeroProps) {
  return (
    <section className="border-b border-sand bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-medium leading-tight tracking-tight text-ink md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              {subtitle}
            </p>
          )}
          {actions && <div className="mt-10 flex flex-wrap gap-4">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
