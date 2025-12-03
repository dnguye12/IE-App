import { doublePrecision, integer, pgTable, text, uuid } from "drizzle-orm/pg-core"

export const food_data = pgTable("food_data", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    calories: doublePrecision("calories").notNull(),
    serving_size_g: doublePrecision("serving_size_g").notNull(),
    fat_total_g: doublePrecision("fat_total_g").notNull(),
    fat_saturated_g: doublePrecision("fat_saturated_g"),
    protein_g: doublePrecision("protein_g").notNull(),
    sodium_mg: integer("sodium_mg"),
    potassium_mg: integer("potassium_mg"),
    cholesterol_mg: integer("cholesterol_mg"),
    carbohydrates_total_g: doublePrecision("carbohydrates_total_g").notNull(),
    fiber_g: doublePrecision("fiber_g"),
    sugar_g: doublePrecision("sugar_g"),
    category: text("category")
})