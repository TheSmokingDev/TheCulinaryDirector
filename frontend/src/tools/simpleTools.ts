import type { CalculatorConfig, CalcValues } from "../components/CalculatorTool";
import { n } from "../components/CalculatorTool";
import { aud, kg, num, pct } from "../utils/format";

const GST = 1.1;

const itemName = {
  key: "itemName",
  label: "Item name",
  type: "text" as const,
  placeholder: "e.g. Whole salmon",
};

export const yieldPercentage: CalculatorConfig = {
  slug: "yield-percentage",
  category: "Yield & Waste",
  title: "Yield %",
  description:
    "Weigh the product as purchased, then weigh what's useable after trimming. The yield percentage tells you how much of what you pay for ends up on a plate.",
  formula: "Useable weight ÷ Total weight × 100 = Yield %",
  fields: [
    itemName,
    { key: "totalWeight", label: "Total weight", unit: "kg" },
    { key: "useableWeight", label: "Useable weight", unit: "kg" },
  ],
  compute: (v: CalcValues) => {
    const total = n(v, "totalWeight");
    const useable = n(v, "useableWeight");
    const result =
      total && useable !== null && total > 0 ? (useable / total) * 100 : null;
    return [
      {
        label: "Yield %",
        value: result === null ? null : pct(result),
        emphasis: true,
      },
    ];
  },
};

export const wastePercentage: CalculatorConfig = {
  slug: "waste-percentage",
  category: "Yield & Waste",
  title: "Waste %",
  description:
    "Enter the total weight purchased and the weight that went in the bin to see waste as a percentage of the product.",
  formula: "Wastage weight ÷ Total weight × 100 = Waste %",
  fields: [
    itemName,
    { key: "totalWeight", label: "Total weight", unit: "kg" },
    { key: "wastageWeight", label: "Wastage weight", unit: "kg" },
  ],
  compute: (v) => {
    const total = n(v, "totalWeight");
    const waste = n(v, "wastageWeight");
    const result =
      total && waste !== null && total > 0 ? (waste / total) * 100 : null;
    return [
      {
        label: "Waste %",
        value: result === null ? null : pct(result),
        emphasis: true,
      },
    ];
  },
};

export const cookingLossPercentage: CalculatorConfig = {
  slug: "cooking-loss-percentage",
  category: "Yield & Waste",
  title: "Cooking Loss %",
  description:
    "Weigh the product before and after cooking to see exactly what the cooking process costs you in weight.",
  formula: "Cooking loss ÷ Useable weight × 100 = Cooking loss %",
  fields: [
    itemName,
    { key: "totalWeight", label: "Total weight", unit: "kg" },
    { key: "useableWeight", label: "Useable weight", unit: "kg" },
    { key: "cookedWeight", label: "Cooked weight", unit: "kg" },
  ],
  compute: (v) => {
    const useable = n(v, "useableWeight");
    const cooked = n(v, "cookedWeight");
    const loss =
      useable !== null && cooked !== null ? useable - cooked : null;
    const result =
      loss !== null && useable && useable > 0 ? (loss / useable) * 100 : null;
    return [
      {
        label: "Cooking loss",
        value: loss === null ? null : kg(loss),
        emphasis: true,
      },
      {
        label: "Cooking loss %",
        value: result === null ? null : pct(result),
        emphasis: true,
      },
    ];
  },
};

export const purchaseWeight: CalculatorConfig = {
  slug: "purchase-weight",
  category: "Yield & Waste",
  title: "Purchase Weight",
  description:
    "How much whole product do you have to order to end up with the portion weight you need? Enter the portion weight required and the product's useable percentage.",
  formula: "Portion weight ÷ Useable % × 100 = Purchase weight",
  fields: [
    itemName,
    { key: "portionWeight", label: "Portion weight required", unit: "kg" },
    { key: "useablePct", label: "Useable %", unit: "%" },
  ],
  compute: (v) => {
    const portion = n(v, "portionWeight");
    const useable = n(v, "useablePct");
    const result =
      portion !== null && useable && useable > 0
        ? (portion / useable) * 100
        : null;
    return [
      {
        label: "Purchase weight",
        value: result === null ? null : kg(result),
        emphasis: true,
      },
    ];
  },
};

export const pricePerKg: CalculatorConfig = {
  slug: "price-per-kg",
  category: "Yield & Waste",
  title: "Price per Kg",
  description:
    "The invoice price per kilo isn't what the product really costs you. Enter the purchase cost and the weights at each stage to see the true cost per kilo as bought, trimmed and cooked.",
  fields: [
    itemName,
    { key: "purchaseCost", label: "Purchase cost", prefix: "$" },
    { key: "purchaseWeight", label: "Purchase weight", unit: "kg" },
    { key: "useableWeight", label: "Useable weight", unit: "kg" },
    { key: "cookedWeight", label: "Cooked weight", unit: "kg" },
  ],
  compute: (v) => {
    const cost = n(v, "purchaseCost");
    const per = (w: number | null) =>
      cost !== null && w && w > 0 ? aud(cost / w) : null;
    return [
      {
        label: "Cost/kg — purchase weight",
        value: per(n(v, "purchaseWeight")),
        emphasis: true,
      },
      {
        label: "Cost/kg — useable weight",
        value: per(n(v, "useableWeight")),
        emphasis: true,
      },
      {
        label: "Cost/kg — cooked weight",
        value: per(n(v, "cookedWeight")),
        emphasis: true,
      },
    ];
  },
};

export const costOfPreparation: CalculatorConfig = {
  slug: "cost-of-preparation",
  category: "Costing",
  title: "Cost of Preparation",
  description:
    "Put a labour cost on any prep task from the hourly rate and the time it takes — ready to add to your recipe costs.",
  formula: "Hourly rate × Time in minutes ÷ 60 = Cost of preparation",
  fields: [
    itemName,
    { key: "hourlyRate", label: "Hourly rate", prefix: "$" },
    { key: "timeMinutes", label: "Time required", unit: "minutes" },
  ],
  compute: (v) => {
    const rate = n(v, "hourlyRate");
    const mins = n(v, "timeMinutes");
    const result =
      rate !== null && mins !== null ? rate * (mins / 60) : null;
    return [
      {
        label: "Cost of preparation",
        value: result === null ? null : aud(result),
        emphasis: true,
      },
    ];
  },
};

export const foodCost: CalculatorConfig = {
  slug: "food-cost",
  category: "Costing",
  title: "Food Cost",
  description:
    "From a menu selling price and your target food cost percentage, see the kitchen revenue after GST and the dollars you have available to spend on the plate.",
  formula: "Kitchen revenue × Food cost % = Food cost $",
  fields: [
    itemName,
    { key: "menuPrice", label: "Menu selling price (inc GST)", prefix: "$" },
    { key: "foodCostPct", label: "Food cost %", unit: "%" },
  ],
  compute: (v) => {
    const price = n(v, "menuPrice");
    const fcPct = n(v, "foodCostPct");
    const revenue = price !== null ? price / GST : null;
    const cost =
      revenue !== null && fcPct !== null ? revenue * (fcPct / 100) : null;
    return [
      {
        label: "Food cost",
        value: cost === null ? null : aud(cost),
        emphasis: true,
      },
      {
        label: "Kitchen revenue (ex GST)",
        value: revenue === null ? null : aud(revenue),
      },
      {
        label: "G.S.T.",
        value: price !== null && revenue !== null ? aud(price - revenue) : null,
      },
    ];
  },
};

export const foodCostPercentage: CalculatorConfig = {
  slug: "food-cost-percentage",
  category: "Costing",
  title: "Food Cost %",
  description:
    "Enter the menu selling price and what the dish costs you to plate. GST comes out first, then the true food cost percentage against kitchen revenue.",
  formula: "Food cost ÷ Kitchen revenue × 100 = Food cost %",
  fields: [
    itemName,
    { key: "menuPrice", label: "Menu selling price (inc GST)", prefix: "$" },
    { key: "foodCost", label: "Food cost", prefix: "$" },
  ],
  compute: (v) => {
    const price = n(v, "menuPrice");
    const cost = n(v, "foodCost");
    const revenue = price !== null ? price / GST : null;
    const fcPct =
      revenue && cost !== null && revenue > 0 ? (cost / revenue) * 100 : null;
    return [
      {
        label: "Food cost %",
        value: fcPct === null ? null : pct(fcPct),
        emphasis: true,
        warn: fcPct !== null && fcPct > 35,
        hint: fcPct !== null && fcPct > 35 ? "Above the 35% benchmark" : undefined,
      },
      {
        label: "Kitchen revenue (ex GST)",
        value: revenue === null ? null : aud(revenue),
      },
      {
        label: "G.S.T.",
        value: price !== null && revenue !== null ? aud(price - revenue) : null,
      },
    ];
  },
};

export const sellingPrice: CalculatorConfig = {
  slug: "selling-price",
  category: "Costing",
  title: "Selling Price",
  description:
    "Work backwards from what a dish costs you: enter the food cost and your target food cost percentage to get the GST-inclusive menu price.",
  formula: "Food cost ÷ Food cost % = Kitchen revenue, + GST = Selling price",
  fields: [
    itemName,
    { key: "foodCost", label: "Food cost", prefix: "$" },
    { key: "foodCostPct", label: "Target food cost %", unit: "%" },
  ],
  compute: (v) => {
    const cost = n(v, "foodCost");
    const fcPct = n(v, "foodCostPct");
    const revenue =
      cost !== null && fcPct && fcPct > 0 ? cost / (fcPct / 100) : null;
    return [
      {
        label: "Menu selling price (inc GST)",
        value: revenue === null ? null : aud(revenue * GST),
        emphasis: true,
      },
      {
        label: "Kitchen revenue (ex GST)",
        value: revenue === null ? null : aud(revenue),
      },
      {
        label: "G.S.T.",
        value: revenue === null ? null : aud(revenue * (GST - 1)),
      },
    ];
  },
};

export const foodCostPeriod: CalculatorConfig = {
  slug: "food-cost-period",
  category: "Spend & Period",
  title: "Food Cost for a Period",
  description:
    "The stocktake method: opening stock plus purchases, less closing stock, gives the food you consumed. Divide by kitchen revenue for your true food cost percentage across the period.",
  formula:
    "(Opening stock + Purchases − Closing stock) ÷ Kitchen revenue × 100 = Food cost %",
  fields: [
    { key: "periodLabel", label: "Period", type: "text", placeholder: "e.g. June 2026" },
    { key: "openingStock", label: "Opening stock", prefix: "$" },
    { key: "purchases", label: "Purchases", prefix: "$" },
    { key: "closingStock", label: "Closing stock", prefix: "$" },
    { key: "kitchenRevenue", label: "Kitchen revenue", prefix: "$" },
  ],
  compute: (v) => {
    const opening = n(v, "openingStock");
    const purchases = n(v, "purchases");
    const closing = n(v, "closingStock");
    const revenue = n(v, "kitchenRevenue");
    const totalStock =
      opening !== null && purchases !== null ? opening + purchases : null;
    const consumed =
      totalStock !== null && closing !== null ? totalStock - closing : null;
    const fcPct =
      consumed !== null && revenue && revenue > 0
        ? (consumed / revenue) * 100
        : null;
    return [
      {
        label: "Food cost %",
        value: fcPct === null ? null : pct(fcPct),
        emphasis: true,
        warn: fcPct !== null && fcPct > 35,
        hint: fcPct !== null && fcPct > 35 ? "Above the 35% benchmark" : undefined,
      },
      {
        label: "Total stock (opening + purchases)",
        value: totalStock === null ? null : aud(totalStock),
      },
      {
        label: "Total food cost for the period",
        value: consumed === null ? null : aud(consumed),
      },
    ];
  },
};

export const dishProfit: CalculatorConfig = {
  slug: "dish-profit",
  category: "Costing",
  title: "Dish Profit",
  description:
    "Set the food, labour and overhead percentages your venue needs, plus the dish's food cost. The tool finds the selling price and shows where every dollar of it goes — including what's actually left as profit.",
  formula: "Food cost ÷ Food cost % = Selling price, then split the dollars",
  fields: [
    itemName,
    { key: "dishFoodCost", label: "Food cost of dish", prefix: "$" },
    { key: "foodCostPct", label: "Food cost required", unit: "%" },
    { key: "labourPct", label: "Labour cost required", unit: "%" },
    { key: "overheadPct", label: "Overhead cost required", unit: "%" },
  ],
  compute: (v) => {
    const cost = n(v, "dishFoodCost");
    const fcPct = n(v, "foodCostPct");
    const labourPct = n(v, "labourPct") ?? 0;
    const overheadPct = n(v, "overheadPct") ?? 0;

    const price =
      cost !== null && fcPct && fcPct > 0 ? cost / (fcPct / 100) : null;
    if (price === null || cost === null) {
      return [
        { label: "Menu selling price", value: null, emphasis: true },
        { label: "Profit", value: null, emphasis: true },
      ];
    }
    const gst = price - price / GST;
    const revenue = price / GST;
    const labour = price * (labourPct / 100);
    const overheads = price * (overheadPct / 100);
    const profit = price - gst - cost - labour - overheads;
    const row = (label: string, value: number) => ({
      label: `${label} (${pct((value / price) * 100)})`,
      value: aud(value),
    });
    return [
      {
        label: "Menu selling price",
        value: aud(price),
        emphasis: true,
      },
      {
        label: "Profit",
        value: aud(profit),
        emphasis: true,
        warn: profit < 0,
        hint: profit < 0 ? "This dish loses money at these targets" : undefined,
      },
      { label: "Kitchen revenue (ex GST)", value: aud(revenue) },
      row("G.S.T.", gst),
      row("Food cost", cost),
      row("Labour", labour),
      row("Overheads", overheads),
      row("Profit", profit),
    ];
  },
};

export const yieldTestSheet: CalculatorConfig = {
  slug: "yield-test-sheet",
  category: "Yield & Waste",
  title: "Yield Test Sheet",
  description:
    "The complete yield test for a cut or dish: enter the weights at purchase, after trimming and after cooking, plus prices, labour and portion size. Everything else — losses, true prices per kilo, portions and cost per serve — is calculated for you.",
  fields: [
    { key: "dishName", label: "Name of dish", type: "text", placeholder: "e.g. Roast scotch fillet" },
    { key: "purchaseWeight", label: "Purchase weight", unit: "kg" },
    { key: "pricePerKilo", label: "Purchase price per kilo", prefix: "$" },
    { key: "trimmedWeight", label: "Weight after trimming", unit: "kg" },
    { key: "cookedWeight", label: "Weight after cooking", unit: "kg" },
    { key: "costPerHour", label: "Average cost per hour", prefix: "$" },
    { key: "prepMinutes", label: "Preparation time", unit: "minutes" },
    { key: "portionSize", label: "Portion size", unit: "kg" },
    { key: "menuPrice", label: "Menu selling price (inc GST)", prefix: "$" },
  ],
  compute: (v) => {
    const purchase = n(v, "purchaseWeight");
    const priceKg = n(v, "pricePerKilo");
    const trimmed = n(v, "trimmedWeight");
    const cooked = n(v, "cookedWeight");
    const rate = n(v, "costPerHour");
    const mins = n(v, "prepMinutes");
    const portion = n(v, "portionSize");
    const menuPrice = n(v, "menuPrice");

    const wastage =
      purchase !== null && trimmed !== null ? purchase - trimmed : null;
    const cookingLoss =
      trimmed !== null && cooked !== null ? trimmed - cooked : null;
    const totalLoss =
      purchase !== null && cooked !== null ? purchase - cooked : null;
    const totalPrice =
      purchase !== null && priceKg !== null ? purchase * priceKg : null;
    const portions =
      cooked !== null && portion && portion > 0 ? cooked / portion : null;
    const leftover =
      portions !== null && cooked !== null && portion !== null
        ? cooked - Math.floor(portions) * portion
        : null;
    const prepCost =
      rate !== null && mins !== null ? rate * (mins / 60) : null;
    const revenue = menuPrice !== null ? menuPrice / GST : null;

    const perServe = (w: number | null) =>
      totalPrice !== null && w && portion && portion > 0
        ? totalPrice / (w / portion)
        : null;
    const serveP = perServe(purchase);
    const serveT = perServe(trimmed);
    const serveC = perServe(cooked);
    const serveCLabour =
      totalPrice !== null && portions && portions > 0 && prepCost !== null
        ? (totalPrice + prepCost) / portions
        : null;
    const fc = (c: number | null) =>
      c !== null && revenue && revenue > 0
        ? ` — ${pct((c / revenue) * 100)} food cost`
        : "";

    const money = (x: number | null, suffix = "") =>
      x === null ? null : aud(x) + suffix;
    const weight = (x: number | null) => (x === null ? null : kg(x));
    const percent = (x: number | null, base: number | null) =>
      x !== null && base && base > 0 ? pct((x / base) * 100) : null;

    return [
      {
        label: "Portions from cooked weight",
        value: portions === null ? null : num(Math.floor(portions * 100) / 100),
        emphasis: true,
      },
      {
        label: "Cost per serve (cooked)",
        value: money(serveC),
        emphasis: true,
      },
      {
        label: "Per serve with labour",
        value: money(serveCLabour),
        emphasis: true,
      },
      { label: "Wastage weight (trimming)", value: weight(wastage) },
      { label: "Wastage %", value: percent(wastage, purchase) },
      { label: "Cooking loss weight", value: weight(cookingLoss) },
      { label: "Cooking loss %", value: percent(cookingLoss, trimmed) },
      { label: "Total loss, purchase to cooked", value: weight(totalLoss) },
      { label: "Total loss %", value: percent(totalLoss, purchase) },
      { label: "Total purchase price", value: money(totalPrice) },
      {
        label: "Price/kg trimmed",
        value:
          totalPrice !== null && trimmed && trimmed > 0
            ? aud(totalPrice / trimmed)
            : null,
      },
      {
        label: "Price/kg cooked",
        value:
          totalPrice !== null && cooked && cooked > 0
            ? aud(totalPrice / cooked)
            : null,
      },
      { label: "Left over after portioning", value: weight(leftover) },
      { label: "Cost of preparation", value: money(prepCost) },
      { label: "Kitchen revenue (ex GST)", value: money(revenue) },
      { label: "Cost per serve (purchase wt)", value: money(serveP, fc(serveP)) },
      { label: "Cost per serve (trimmed wt)", value: money(serveT, fc(serveT)) },
      {
        label: "Cost per serve (cooked, with labour)",
        value: money(serveCLabour, fc(serveCLabour)),
      },
    ];
  },
};

export const simpleTools: CalculatorConfig[] = [
  yieldPercentage,
  wastePercentage,
  cookingLossPercentage,
  purchaseWeight,
  pricePerKg,
  costOfPreparation,
  foodCost,
  foodCostPercentage,
  sellingPrice,
  foodCostPeriod,
  dishProfit,
  yieldTestSheet,
];
