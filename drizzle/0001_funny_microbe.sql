CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"grams" double precision,
	"calories" double precision NOT NULL,
	"protein" double precision NOT NULL,
	"carbs" double precision NOT NULL,
	"fats" double precision NOT NULL,
	"fiber" double precision,
	"isFixed" boolean,
	"isAutoAdded" boolean,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "food_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"calories" double precision NOT NULL,
	"serving_size_g" double precision NOT NULL,
	"fat_total_g" double precision NOT NULL,
	"fat_saturated_g" double precision,
	"protein_g" double precision NOT NULL,
	"sodium_mg" integer,
	"potassium_mg" integer,
	"cholesterol_mg" integer,
	"carbohydrates_total_g" double precision NOT NULL,
	"fiber_g" double precision,
	"sugar_g" double precision,
	"category" text NOT NULL
);
