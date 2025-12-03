export type FoodRequirement = {
    foodNames: string;
    foodQuantity: number;
}

export type Food = {
    name: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number | null;
    isFixed: boolean;
    isAutoAdded: boolean;
    category: string;
}

export type FoodData = {
    name: string;
    calories: number;
    serving_size_g: number;
    fat_total_g: number;
    fat_saturated_g?: number | null;
    protein_g: number;
    sodium_mg?: number | null;
    potassium_mg?: number | null;
    cholesterol_mg?: number | null;
    carbohydrates_total_g: number;
    fiber_g?: number | null;
    sugar_g?: number | null;
    category: string | null;
}