import { boolean, doublePrecision, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const foods = pgTable("foods", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    grams: doublePrecision("grams"),
    calories: doublePrecision("calories").notNull(),
    protein: doublePrecision("protein").notNull(),
    carbs: doublePrecision("carbs").notNull(),
    fats: doublePrecision("fats").notNull(),
    fiber: doublePrecision("fiber"),
    isFixed: boolean("isFixed"),
    isAutoAdded: boolean("isAutoAdded"),
    category: text("category")
})