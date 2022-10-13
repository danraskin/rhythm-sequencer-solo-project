CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "insterted_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

CREATE TABLE "sample_kits" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (50),
    "BD" VARCHAR (500),
    "SD" VARCHAR (500),
    "HH" VARCHAR (500)
);

CREATE TABLE "patterns" (
    "id" SERIAL PRIMARY KEY,
    -- "user_id" INT REFERENCES "user",
    "kit_id" INT REFERENCES "sample_kits" NOT NULL,
    "name" VARCHAR (80) NOT NULL,
    "steps" INT NOT NULL,
    "steps_total" INT NOT NULL,
    "inserted_at" TIMESTAMP,
    "updated_at" TIMESTAMP
);

CREATE TABLE "drum_type_lookup" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (2)
);

CREATE TABLE "steps" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INT REFERENCES "patterns" NOT NULL,
    "step" INT,
    "BD" BOOLEAN,
    "SD" BOOLEAN,
    "HH" BOOLEAN
);

CREATE TABLE "pattern_params" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INT REFERENCES "patterns" NOT NULL,
    "drum_id" INT REFERENCES "drum_type_lookup" NOT NULL,
    "param_volume" INT,
    "param_pitch" INT
);

-- SEED SAMPLE_KITS

INSERT INTO "sample_kits" ("name","BD","SD","HH")
    VALUES
    ('Test kit 1','BD.WAV','TOTAL_808_SAMPLE 9_S08.WAV','TOTAL_808_SAMPLE 11_S10.WAV'),
    ('Test kit 2','TOTAL_808_SAMPLE 26_S25.WAV','TOTAL_808_SAMPLE 17_S16.WAV','TOTAL_808_SAMPLE 23_S22.WAV');