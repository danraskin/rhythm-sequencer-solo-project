
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "insterted_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

CREATE TABLE "patterns" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER FOREIGN KEY "user",
    "kit_id" INTEGER FOREIGN KEY "drum_kits",
    "name" VARCHAR (80) NOT NULL,
    "steps" INTEGER NOT NULL,
    "steps_total" INTEGER NOT NULL,
    "inserted_at" TIMESTAMP,
    "updated_at" TIMESTAMP
)

CREATE TABLE "drum_kits" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (50),
    "BD" VARCHAR (500),
    "SD" VARCHAR (500),
    "HH" VARCHAR (500)
)

CREATE TABLE "drum_type_lookup" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (2)
)

CREATE TABLE "steps" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INTEGER FOREIGN KEY "patterns",
    "step" INTEGER,
    "BD" BOOLEAN,
    "SD" BOOLEAN,
    "HH" BOOLEAN
)

CREATE TABLE "pattern_params" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INTEGER FOREIGN KEY "patterns",
    "drum_id" INTEGER FOREIGN KEY "drum_type_lookup",
    "param_volume" INTEGER,
    "param_pitch" INTEGER
)