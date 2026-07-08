import type { ReactNode } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PageLayout from "./PageLayout";

export interface ToolPageShellProps {
  category: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolPageShell({
  category,
  title,
  description,
  children,
}: ToolPageShellProps) {
  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/"
          className="brand-label mb-8 inline-flex items-center gap-2 text-xs text-ink/60 hover:text-maroon"
        >
          <ArrowLeftOutlined /> All tools
        </Link>
        <p className="brand-label mb-3 mt-6 text-xs text-maroon">{category}</p>
        <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">
          {description}
        </p>
        <div className="mt-12 border border-sand bg-cream-light p-6 md:p-10">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}
