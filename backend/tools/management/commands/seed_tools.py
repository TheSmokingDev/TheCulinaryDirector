from django.core.management.base import BaseCommand

from tools.models import Tool

TOOLS = [
    # --- Costing ---
    {
        "name": "Recipe Cost Sheet",
        "slug": "recipe-cost-sheet",
        "tagline": "Cost a full recipe with wastage, labour and target selling prices.",
        "description": (
            "The complete recipe card: ingredients with wastage percentages, "
            "cost per portion, GST, gross profit, labour, and suggested "
            "selling prices for your target food cost percentages."
        ),
        "category": "Costing",
        "icon": "FileTextOutlined",
        "sort_order": 1,
    },
    {
        "name": "Food Cost Calculator",
        "slug": "food-cost-calculator",
        "tagline": "Know the exact cost and margin of every dish you plate.",
        "description": (
            "Enter your ingredients, quantities and menu price to see your "
            "plate cost, food cost percentage and gross profit per dish."
        ),
        "category": "Costing",
        "icon": "CalculatorOutlined",
        "sort_order": 2,
    },
    {
        "name": "Food Cost",
        "slug": "food-cost",
        "tagline": "What should a dish cost you, given its menu price?",
        "description": (
            "From a menu selling price and your target food cost percentage, "
            "see the kitchen revenue, GST and the dollars you can spend on "
            "the plate."
        ),
        "category": "Costing",
        "icon": "DollarOutlined",
        "sort_order": 3,
    },
    {
        "name": "Food Cost %",
        "slug": "food-cost-percentage",
        "tagline": "Check the food cost percentage of any dish.",
        "description": (
            "Enter the menu selling price and the plate cost to see kitchen "
            "revenue after GST and the true food cost percentage."
        ),
        "category": "Costing",
        "icon": "PercentageOutlined",
        "sort_order": 4,
    },
    {
        "name": "Selling Price",
        "slug": "selling-price",
        "tagline": "Set a menu price from your plate cost and target food cost %.",
        "description": (
            "Work backwards from what a dish costs you: enter the food cost "
            "and your target percentage to get the GST-inclusive menu price."
        ),
        "category": "Costing",
        "icon": "TagOutlined",
        "sort_order": 5,
    },
    {
        "name": "Dish Profit",
        "slug": "dish-profit",
        "tagline": "See where every dollar of a dish's price actually goes.",
        "description": (
            "Set your required food, labour and overhead percentages and the "
            "dish's food cost to find the selling price and the full dollar "
            "breakdown — including what's left as profit."
        ),
        "category": "Costing",
        "icon": "PieChartOutlined",
        "sort_order": 6,
    },
    {
        "name": "Cost of Preparation",
        "slug": "cost-of-preparation",
        "tagline": "Put a labour cost on any prep task.",
        "description": (
            "Hourly rate and time taken — the labour cost of preparation, "
            "ready to add to your recipe costs."
        ),
        "category": "Costing",
        "icon": "ClockCircleOutlined",
        "sort_order": 7,
    },
    # --- Yield & Waste ---
    {
        "name": "Yield %",
        "slug": "yield-percentage",
        "tagline": "How much of what you buy actually ends up useable?",
        "description": (
            "Total weight in, useable weight out — the yield percentage of "
            "any product."
        ),
        "category": "Yield & Waste",
        "icon": "GoldOutlined",
        "sort_order": 8,
    },
    {
        "name": "Waste %",
        "slug": "waste-percentage",
        "tagline": "Turn trim and offcuts into a percentage you can track.",
        "description": (
            "Enter the total weight and the wastage weight to get waste as a "
            "percentage of what you purchased."
        ),
        "category": "Yield & Waste",
        "icon": "ScissorOutlined",
        "sort_order": 9,
    },
    {
        "name": "Cooking Loss %",
        "slug": "cooking-loss-percentage",
        "tagline": "Measure what the oven takes from your useable weight.",
        "description": (
            "Compare useable weight to cooked weight to see cooking loss in "
            "kilograms and as a percentage."
        ),
        "category": "Yield & Waste",
        "icon": "FireOutlined",
        "sort_order": 10,
    },
    {
        "name": "Yield Test Sheet",
        "slug": "yield-test-sheet",
        "tagline": "The full yield test: purchase to trimmed to cooked, with costs.",
        "description": (
            "One sheet for a complete yield test — wastage and cooking loss "
            "weights and percentages, price per kilo at every stage, portions "
            "per cook, and cost per serve with and without labour."
        ),
        "category": "Yield & Waste",
        "icon": "ExperimentOutlined",
        "sort_order": 11,
    },
    {
        "name": "Purchase Weight",
        "slug": "purchase-weight",
        "tagline": "How much do you need to order to end up with enough?",
        "description": (
            "From the portion weight you need and the product's useable "
            "percentage, calculate the weight you have to purchase."
        ),
        "category": "Yield & Waste",
        "icon": "ShoppingCartOutlined",
        "sort_order": 12,
    },
    {
        "name": "Price per Kg",
        "slug": "price-per-kg",
        "tagline": "The real price per kilo — as bought, trimmed and cooked.",
        "description": (
            "Your invoice price per kilo isn't what the product costs you. "
            "See cost per kg at purchase, useable and cooked weights."
        ),
        "category": "Yield & Waste",
        "icon": "ShoppingOutlined",
        "sort_order": 13,
    },
    {
        "name": "Wastage Chart",
        "slug": "wastage-chart",
        "tagline": "Log what goes in the bin — what, why, who and how much.",
        "description": (
            "Record each wastage event with the reason, people involved and "
            "cost. Use it as a training tool and fact-finder to lower food "
            "cost — not to discipline staff."
        ),
        "category": "Yield & Waste",
        "icon": "DeleteOutlined",
        "sort_order": 14,
    },
    # --- Spend & Period ---
    {
        "name": "Food Cost for a Period",
        "slug": "food-cost-period",
        "tagline": "Your true food cost % across any stock period.",
        "description": (
            "Opening stock plus purchases, less closing stock, against "
            "kitchen revenue — the food cost percentage for the period."
        ),
        "category": "Spend & Period",
        "icon": "CalendarOutlined",
        "sort_order": 15,
    },
    {
        "name": "Weekly Spend",
        "slug": "weekly-spend",
        "tagline": "Track supplier spend against revenue, day by day.",
        "description": (
            "Log what you spend with each supplier and what each meal period "
            "takes, then see average spend per customer, turnover mix and "
            "your expected food cost percentage for the week."
        ),
        "category": "Spend & Period",
        "icon": "TableOutlined",
        "sort_order": 16,
    },
    {
        "name": "Sales vs Purchases",
        "slug": "sales-vs-purchases",
        "tagline": "A quick daily food cost pulse: purchases over sales.",
        "description": (
            "Enter each day's purchases and sales for the week to watch your "
            "running food cost percentage day by day."
        ),
        "category": "Spend & Period",
        "icon": "RiseOutlined",
        "sort_order": 17,
    },
    # --- Menu & Kitchen Ops ---
    {
        "name": "Menu Analysis",
        "slug": "menu-analysis",
        "tagline": "Find your Stars, Plowhorses, Puzzles and Dogs.",
        "description": (
            "Enter each menu item's sales, food cost and price to classify "
            "your menu by popularity and contribution margin — and see "
            "exactly which dishes to promote, re-price or retire."
        ),
        "category": "Menu & Profit",
        "icon": "FundOutlined",
        "sort_order": 18,
    },
    {
        "name": "Recipe Scaler",
        "slug": "recipe-scaler",
        "tagline": "Scale any recipe up or down without the mental maths.",
        "description": (
            "Convert a recipe from one yield to another in seconds. Perfect "
            "for prepping functions, banquets and changing par levels."
        ),
        "category": "Kitchen Ops",
        "icon": "ExpandAltOutlined",
        "sort_order": 19,
    },
]


class Command(BaseCommand):
    help = "Seed the tools catalogue"

    def handle(self, *args, **options):
        created = 0
        for data in TOOLS:
            data = {**data, "status": Tool.Status.AVAILABLE}
            _, was_created = Tool.objects.update_or_create(
                slug=data["slug"], defaults=data
            )
            created += was_created

        slugs = [t["slug"] for t in TOOLS]
        removed, _ = Tool.objects.exclude(slug__in=slugs).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(TOOLS)} tools ({created} new, "
                f"{len(TOOLS) - created} updated, {removed} removed)."
            )
        )
