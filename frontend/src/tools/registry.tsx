import type { ComponentType } from "react";
import CalculatorTool from "../components/CalculatorTool";
import FoodCostCalculatorPage from "../pages/FoodCostCalculatorPage";
import RecipeScalerPage from "../pages/RecipeScalerPage";
import MenuAnalysisPage from "../pages/tools/MenuAnalysisPage";
import RecipeCostSheetPage from "../pages/tools/RecipeCostSheetPage";
import SalesVsPurchasesPage from "../pages/tools/SalesVsPurchasesPage";
import WastageChartPage from "../pages/tools/WastageChartPage";
import WeeklySpendPage from "../pages/tools/WeeklySpendPage";
import { simpleTools } from "./simpleTools";

/** slug → tool page. The backend catalogue drives what's listed; this drives what renders. */
export const toolRegistry: Record<string, ComponentType> = {
  "food-cost-calculator": FoodCostCalculatorPage,
  "recipe-scaler": RecipeScalerPage,
  "recipe-cost-sheet": RecipeCostSheetPage,
  "menu-analysis": MenuAnalysisPage,
  "weekly-spend": WeeklySpendPage,
  "sales-vs-purchases": SalesVsPurchasesPage,
  "wastage-chart": WastageChartPage,
  ...Object.fromEntries(
    simpleTools.map((config) => [
      config.slug,
      () => <CalculatorTool config={config} />,
    ]),
  ),
};
