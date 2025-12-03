import { db } from "@/db"
import { food_data } from "@/db/schemas/food_data"
import { eq } from "drizzle-orm"

export const isFoodPresent = async (foodName: string) => {
    try {
        const foods = await db.select().from(food_data).where(eq(food_data.name, foodName))

        if (foods.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

export const categorizeFood = (p: number, c: number, f: number, fiber: number, cal: number) => {
    const totalCalFromMacros = (p * 4) + (c * 4) + (f * 9)
    if (totalCalFromMacros <= 0 || cal <= 0) {
        return "Vegetable"
    }

    const pRatio = (p * 4) / totalCalFromMacros;
    const cRatio = (c * 4) / totalCalFromMacros;
    const fRatio = (f * 9) / totalCalFromMacros;

    if (cal < 80) {
        if ((c > 0 && fiber / c > 0.2) || cal < 30 || pRatio > 0.4) {
            return "Vegetable";
        }
        return "Fruit";
    }

    if (fRatio > 0.50) return "Fat";
    if (cRatio > 0.55) return "Carbs";
    if (pRatio > 0.35) return "Protein";
    if (p > 3) return "Dairy";

    if (pRatio >= cRatio && pRatio >= fRatio) return "Protein";
    if (fRatio >= cRatio && fRatio >= pRatio) return "Fat";
    return "Carbs";
}