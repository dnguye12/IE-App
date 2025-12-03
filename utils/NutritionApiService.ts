import { db } from "@/db";
import { categorizeFood, isFoodPresent } from "./NutritionDBWriter";
import { Food, FoodData, FoodRequirement } from "./types";
import { food_data } from "@/db/schemas/food_data";
import { eq } from "drizzle-orm";

export const fromAPIData = (item: FoodData): Food => {
    let servingSize = item.serving_size_g ? item.serving_size_g : 100
    if (servingSize === 0) {
        servingSize = 100
    }
    const scaleFactor = 100 / servingSize
    const calories = item.calories * scaleFactor;
    const protein = item.protein_g * scaleFactor;
    const carbs = item.carbohydrates_total_g * scaleFactor;
    const fats = item.fat_total_g * scaleFactor;
    const fiber = (item.fiber_g ?? 0) * scaleFactor;
    const category = categorizeFood(protein, carbs, fats, fiber, calories)

    return {
        name: item.name,
        grams: 0,
        calories,
        protein,
        carbs,
        fats,
        fiber,
        isFixed: false,
        isAutoAdded: false,
        category
    }
}

export const fetchNutritionFromExternalApi = async (foodRequirements: FoodRequirement[]) => {
    const foods = []
    let query = ""
    let needsUpdate = false

    for (const food of foodRequirements) {
        const present = await isFoodPresent(food.foodNames)
        if (!present) {
            needsUpdate = true
        }
        query += food.foodNames + " "
    }

    if (!needsUpdate) {
        for (const food of foodRequirements) {
            const [helper] = await db.select().from(food_data).where(eq(food_data.name, food.foodNames))
            foods.push(helper)
        }
        return foods
    }

    try {
        query = query.trim()
        const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "X-Api-Key": process.env.NUTRITION_API!
            }
        })
        if (res.ok) {
            const data = await res.json()
            for (const item of data.items) {
                const present = await isFoodPresent(item.name)
                if (!present) {
                    const servingSize = item.serving_size_g
                    const scaleFactor = 100.0 / servingSize
                    const calories = item.calories * scaleFactor;
                    const protein = item.protein_g * scaleFactor;
                    const carbs = item.carbohydrates_total_g * scaleFactor;
                    const fats = item.fat_total_g * scaleFactor;
                    const fiber = (item.fiber_g ?? 0) * scaleFactor;
                    const category = categorizeFood(protein, carbs, fats, fiber, calories)

                    const [savedFood] = await db.insert(food_data).values({
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
                        category,
                    }).returning();
                    foods.push(savedFood)
                } else {
                    const [food] = await db.select().from(food_data).where(eq(food_data.name, item.name))
                    foods.push(food)
                }
            }
            return foods
        } else {
            throw new Error("No nutrition data found")
        }
    } catch (error) {
        console.log(error)
    }
}