import { db } from "@/db";
import { food_data } from "@/db/schemas/food_data";
import { fetchNutritionFromExternalApi, fromAPIData } from "@/utils/NutritionApiService";
import { Food } from "@/utils/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const TARGET_CARBS_PERCENT = 50.0;
const TARGET_PROTEIN_PERCENT = 30.0;
const TARGET_FAT_PERCENT = 20.0;
const MIN_VEGETABLE_GRAMS = 200.0;
const MIN_FRUIT_GRAMS = 150.0;

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { targetCalories, foods, notWantedFoods } = body

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = {
        inputSummary: {},
        nutritionSummary: {},
        autoAddedItems: [],
        plan: [],
    }

    const bannedFoods = notWantedFoods.map((f: string) => f.trim().toLowerCase())
    const wantedFoods = await fetchNutritionFromExternalApi(foods)
    const plan: Food[] = []
    if (wantedFoods && wantedFoods.length > 0 && foods.length > 0) {
        for (const f of foods) {
            for (let i = 0; i < wantedFoods.length; i++) {
                const wantedFood = wantedFoods[i]
                if (!wantedFood) {
                    continue
                }
                if (wantedFood.name.trim().toLowerCase() === f.foodNames.trim().toLowerCase()) {
                    const foodItem: Food = {
                        name: wantedFood.name,
                        grams: f.foodQuantity,
                        calories: wantedFood.calories,
                        protein: wantedFood.protein_g,
                        carbs: wantedFood.carbohydrates_total_g,
                        fats: wantedFood.fat_total_g,
                        fiber: wantedFood.fiber_g,
                        isFixed: f.foodQuantity !== -1,
                        isAutoAdded: false,
                        category: wantedFood.category ?? "Carbs"
                    }
                    plan.push(foodItem)
                }
            }
        }
    }

    res.inputSummary.targetCalories = targetCalories;
    res.inputSummary.inputFoodsCount = foods.length;

    const fixedList = plan.filter((f) => f.isFixed)
    const variableList = plan.filter((f) => !f.isFixed)

    const currentCal = fixedList.reduce((acc, f) => acc + (f.grams * f.calories / 100), 0)
    let remainingCal = targetCalories - currentCal


    if (remainingCal < 0) {
        const scale = targetCalories / (currentCal > 0 ? currentCal : 1)
        for (const f of fixedList) {
            f.grams *= scale
        }
        remainingCal = 0
    }
    if (remainingCal > 50) {
        const addedLogs = await fillNutritionalGaps(variableList, fixedList, bannedFoods)
        res.autoAddedItems = addedLogs
    }

    remainingCal = applyVegetableConstraint(variableList, remainingCal)
    remainingCal = applyFruitConstraint(variableList, remainingCal)

    allocateRemainingBudget(variableList, remainingCal)

    let finalPlan: Food[] = []
    finalPlan = finalPlan.concat(fixedList)
    finalPlan = finalPlan.concat(variableList)

    res.plan = finalPlan

    calculateFinalNutrition(res, finalPlan)
    return NextResponse.json(res)
}

const isProteinSource = (f: Food) => {
    return f.category === "Protein" || f.category === "Seafood" || f.category === "Dairy"
}

const isCarbSource = (f: Food) => {
    return f.category === "Carbs" || f.category === "Grains" || f.category === "Fruit"
}

const fetchRandomItem = async (category: string, fixedList: Food[], bannedFoods: string[]): Promise<Food | null> => {
    const res = await db.select().from(food_data).where(eq(food_data.category, category))
    const helper = fixedList.map((f) => f.name.trim().toLowerCase())
    const banned = bannedFoods.map((b) => b.trim().toLowerCase())
    const candidates = res.filter((row) => {
        const name = row.name.trim().toLowerCase()
        return !banned.includes(name) && !helper.includes(name)
    })

    if (candidates.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const foodItem: Food = fromAPIData(candidates[randomIndex]);

    return foodItem;

}

const fillNutritionalGaps = async (variableList: Food[], fixedList: Food[], bannedFoods: string[]) => {
    const logs: string[] = []

    const hasProtein = variableList.some((f) => isProteinSource(f))
    const hasCarbs = variableList.some((f) => isCarbSource(f))
    const hasVeg = variableList.some((f) => f.category === "Vegetable")
    const hasFruit = variableList.some((f) => f.category === "Fruit")
    const hasFat = variableList.some((f) => f.category === "Fat")

    if (!hasProtein) {
        const item = await fetchRandomItem("Protein", fixedList, bannedFoods)
        if (item) {
            item.isAutoAdded = true
            variableList.push(item)
            logs.push("Protein source missing, auto added: " + item.name)
        }
    }

    if (!hasCarbs) {
        const item = await fetchRandomItem("Carbs", fixedList, bannedFoods)
        if (item) {
            item.isAutoAdded = true
            variableList.push(item)
            logs.push("Carbs source missing, auto added: " + item.name)
        }
    }

    if (!hasVeg) {
        const item = await fetchRandomItem("Vegetable", fixedList, bannedFoods)
        if (item) {
            item.isAutoAdded = true
            variableList.push(item)
            logs.push("Vegetables missing, auto added: " + item.name)
        }
    }

    if (!hasFruit) {
        const item = await fetchRandomItem("Fruit", fixedList, bannedFoods)
        if (item) {
            item.isAutoAdded = true
            variableList.push(item)
            logs.push("Fruit missing, auto added: " + item.name)
        }
    }

    if (!hasFat) {
        const item = await fetchRandomItem("Fat", fixedList, bannedFoods)
        if (item) {
            item.isAutoAdded = true
            variableList.push(item)
            logs.push("Fat source missing, auto added: " + item.name)
        }
    }

    return logs
}

const applyVegetableConstraint = (variableList: Food[], remainingCal: number) => {
    let helper = remainingCal
    for (const food of variableList) {
        if (food.category === "Vegetable") {
            if (food.grams < MIN_VEGETABLE_GRAMS) {
                food.grams = MIN_VEGETABLE_GRAMS
            }
            helper -= ((food.grams * food.calories) / 100)
        }
    }
    return Math.max(0, helper)
}

const applyFruitConstraint = (variableList: Food[], remainingCal: number) => {
    if (remainingCal < 50) {
        return remainingCal
    }
    let helper = remainingCal
    for (const food of variableList) {
        if (food.category === "Fruit") {
            if (food.grams < MIN_FRUIT_GRAMS) {
                food.grams = MIN_FRUIT_GRAMS
            }
            helper -= ((food.grams * food.calories) / 100)
        }
    }
    return Math.max(0, helper)
}

const allocateRemainingBudget = (variableList: Food[], remainingCal: number) => {
    if (remainingCal <= 0) {
        return
    }

    let proteinBudget = remainingCal * (TARGET_PROTEIN_PERCENT / 100)
    let carbsBudget = remainingCal * (TARGET_CARBS_PERCENT / 100.0);
    let fatBudget = remainingCal * (TARGET_FAT_PERCENT / 100.0);

    const pGroup: Food[] = []
    const cGroup: Food[] = []
    const fGroup: Food[] = []

    for (const food of variableList) {
        if (food.category === "Vegetable" && food.grams > 0) {
            continue
        }
        if (food.category === "Fruit" && food.grams > 0) {
            continue
        }
        switch (food.category) {
            case "Protein":
            case "Dairy":
                pGroup.push(food)
                break
            case "Carbs":
                cGroup.push(food)
                break
            case "Fat":
                fGroup.push(food)
                break
            default:
                cGroup.push(food)
        }
    }

    if (cGroup.length === 0) {
        for (let i = 0; i < variableList.length; i++) {
            if (variableList[i].category === "Fruit") {
                cGroup.push(variableList[i])
            }
        }
    }

    if (fGroup.length === 0) {
        proteinBudget += fatBudget / 2
        carbsBudget += fatBudget / 2
        fatBudget = 0
    }

    if (cGroup.length === 0) {
        proteinBudget += carbsBudget
        carbsBudget = 0
    }

    if (pGroup.length === 0) {
        carbsBudget += proteinBudget
        proteinBudget = 0
    }

    distributeToGroup(pGroup, proteinBudget)
    distributeToGroup(cGroup, carbsBudget)
    distributeToGroup(fGroup, fatBudget)
}

const distributeToGroup = (group: Food[], calorieBudget: number) => {
    if (group.length === 0) {
        return
    }
    const calPerItem = calorieBudget / group.length
    for (const food of group) {
        if (food.calories > 0) {
            const helper = (calPerItem / food.calories) * 100
            food.grams += helper
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateFinalNutrition = (res: any, plan: Food[]) => {
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    for (const food of plan) {
        totalCal += (food.grams * food.calories) / 100
        totalP += (food.grams * food.protein) / 100
        totalC += (food.grams * food.carbs) / 100
        totalF += (food.grams * food.fats) / 100
    }
    res.nutritionSummary.totalCalories = Math.round(totalCal * 10.0) / 10.0;
    res.nutritionSummary.totalProtein = Math.round(totalP * 10.0) / 10.0;
    res.nutritionSummary.totalCarbs = Math.round(totalC * 10.0) / 10.0;
    res.nutritionSummary.totalFat = Math.round(totalF * 10.0) / 10.0;

    if (totalCal > 0) {
        res.nutritionSummary.proteinPercent = Math.round((totalP * 4 / totalCal) * 100.0);
        res.nutritionSummary.carbsPercent = Math.round((totalC * 4 / totalCal) * 100.0);
        res.nutritionSummary.fatPercent = Math.round((totalF * 9 / totalCal) * 100.0);
    }
}