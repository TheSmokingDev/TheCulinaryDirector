export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {kicker && (
        <p className="brand-label mb-3 text-xs text-maroon">{kicker}</p>
      )}
      <h2 className="text-3xl font-medium tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-ink/70">{subtitle}</p>}
    </div>
  );
}
