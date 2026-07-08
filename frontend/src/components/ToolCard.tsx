import { Tag } from "antd";
import { Link } from "react-router-dom";
import type { Tool } from "../api/services/tools";
import BrandButton from "./BrandButton";
import ToolIllustration from "./ToolIllustration";

export interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const comingSoon = tool.status === "coming_soon";

  return (
    <div className="flex flex-col border border-sand bg-cream-light transition-shadow hover:shadow-md">
      <div className="flex h-36 items-center justify-center border-b border-sand bg-cream">
        <ToolIllustration
          slug={tool.slug}
          icon={tool.icon}
          className={comingSoon ? "opacity-40" : ""}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="brand-label text-[11px] text-ink/50">
            {tool.category}
          </span>
          {comingSoon && (
            <Tag className="brand-label !m-0 !border-sand !bg-transparent !text-[10px] !text-ink/50">
              Coming soon
            </Tag>
          )}
        </div>
        <h3 className="text-xl font-medium text-ink">{tool.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
          {tool.tagline}
        </p>
        <div className="mt-6">
          {comingSoon ? (
            <BrandButton variantStyle="outline" disabled block>
              Coming soon
            </BrandButton>
          ) : (
            <Link to={`/tools/${tool.slug}`} className="block">
              <BrandButton block>Open tool</BrandButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
