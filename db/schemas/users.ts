import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    password: text("password_hash").notNull(),
    sign: text("sign"),
    age: text("age"),
    gender: text("gender"),
    weight: text("weight"),
    height: text("height"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export type User = typeof users.$inferSelect