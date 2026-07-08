import { Navigate, useParams } from "react-router-dom";
import { toolRegistry } from "../tools/registry";

export default function ToolResolverPage() {
  const { slug } = useParams<{ slug: string }>();
  const Tool = slug ? toolRegistry[slug] : undefined;

  if (!Tool) return <Navigate to="/" replace />;
  return <Tool />;
}
