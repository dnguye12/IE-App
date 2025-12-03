
import fs from "fs/promises";
import { FoodData, FoodRequirement } from "@/utils/types";
import { db } from "@/db";
import { food_data } from "@/db/schemas/food_data";
import { categorizeFood } from "@/utils/NutritionDBWriter";

const BATCH_SIZE = 50;

const loadFood = async () => {
    const filePath = "scripts/food_test_clean.json"
    const raw = await fs.readFile(filePath, "utf-8")
    return JSON.parse(raw)
}

const buildBatches = (foods: FoodRequirement[]): FoodRequirement[][] => {
    const batches: FoodRequirement[][] = [];
    for (let i = 0; i < foods.length; i += BATCH_SIZE) {
        batches.push(foods.slice(i, i + BATCH_SIZE));
    }
    return batches;
}

const fetchNutritionForBatch = async (batch: FoodRequirement[]) => {
    const queryBuilder: string[] = [];

    for (const food of batch) {
        if (food.foodNames && food.foodNames.trim().length > 0) {
            queryBuilder.push(food.foodNames.trim());
        }
    }

    let rawQuery = queryBuilder.join(" ");
    rawQuery = rawQuery.trim();
    if (!rawQuery) return [];

    try {
        const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${rawQuery}`, {
            method: "GET",
            headers: {
                "X-Api-Key": process.env.NUTRITIONAPI!
            }
        })

        if (!res.ok) {
            console.error("CalorieNinjas error:", res.status, await res.text());
            return [];
        }

        const json = await res.json()
        return json.items ?? []
    } catch (error) {
        console.error("Batch request failed:", error);
        return [];
    }
}

const insertItems = async (items: FoodData[]) => {
    if (items.length === 0) return;

    for (const item of items) {
        const category = categorizeFood(item.protein_g, item.carbohydrates_total_g, item.fat_total_g, item.fiber_g ?? 0, item.calories)
        await db.insert(food_data).values({
            name: item.name,
            calories: item.calories,
            serving_size_g: item.serving_size_g,
            fat_total_g: item.fat_total_g,
            fat_saturated_g: item.fat_saturated_g,
            protein_g: item.protein_g,
            sodium_mg: item.sodium_mg,
            potassium_mg: item.potassium_mg,
            cholesterol_mg: item.cholesterol_mg,
            carbohydrates_total_g: item.carbohydrates_total_g,
            fiber_g: item.fiber_g,
            sugar_g: item.sugar_g,
            category
        })
    }
}

async function main() {
    const requestData = await loadFood();
    const allFoodRequirements = requestData.foods ?? [];

    const batches = buildBatches(allFoodRequirements);
    for (let i = 0; i < batches.length; i++) {
        console.log(`Processing batch ${i + 1}/${batches.length}...`);
        const items = await fetchNutritionForBatch(batches[i]);
        await insertItems(items);
        console.log(`  Received ${items.length} items`);
    }
    console.log("Seeding completed.");
}

main().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});