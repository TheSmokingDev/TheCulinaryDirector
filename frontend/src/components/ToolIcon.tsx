import {
  CalculatorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  ExpandAltOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FireOutlined,
  FundOutlined,
  GoldOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  PercentageOutlined,
  PieChartOutlined,
  RiseOutlined,
  ScissorOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TableOutlined,
  TagOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  CalculatorOutlined: <CalculatorOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  ClockCircleOutlined: <ClockCircleOutlined />,
  DeleteOutlined: <DeleteOutlined />,
  DollarOutlined: <DollarOutlined />,
  ExpandAltOutlined: <ExpandAltOutlined />,
  ExperimentOutlined: <ExperimentOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  FireOutlined: <FireOutlined />,
  FundOutlined: <FundOutlined />,
  GoldOutlined: <GoldOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  OrderedListOutlined: <OrderedListOutlined />,
  PercentageOutlined: <PercentageOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  RiseOutlined: <RiseOutlined />,
  ScissorOutlined: <ScissorOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
  TableOutlined: <TableOutlined />,
  TagOutlined: <TagOutlined />,
  TeamOutlined: <TeamOutlined />,
};

export default function ToolIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={className}>{ICONS[name] ?? <ToolOutlined />}</span>
  );
}
