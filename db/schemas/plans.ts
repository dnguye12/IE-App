import { Food } from "@/utils/types";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

type FoodInput = {
  foodNames: string;
  foodQuantity: number;
};

type Macros = {
  protein: number;
  carbs: number;
  fats: number;
};

type DrInput = {
  username: string;
  planname: string;
  targetCalories: number;
  foods: FoodInput[];
  notWantedFoods: string[];
  macros: Macros;
};

type InputSummary = {
  targetCalories: number;
  inputFoodsCount: number;
};

type NutritionSummary = {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
};

type Result = {
  inputSummary: InputSummary;
  nutritionSummary: NutritionSummary;
  autoAddedItems: string[];
  plan: Food[]
}

export const plans = pgTable("plans", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username"),
    planname: text("planname").unique(),
    dr: jsonb('dr').$type<DrInput>().notNull(),
    result: jsonb('result').$type<Result>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})