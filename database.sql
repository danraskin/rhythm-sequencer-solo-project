-- DROP TABLE "user", "sample_kits", "patterns", "drum_type_lookup", "steps", "pattern_params" CASCADE;

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
    -- "insterted_at" TIMESTAMP,
    -- "updated_at" TIMESTAMP
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
    "user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "kit_id" INTEGER REFERENCES "sample_kits" NOT NULL,
    "name" VARCHAR (80) NOT NULL,
    --"steps" INT NOT NULL, -- distinction b/w steps and step_total not implemented
    "steps_total" INT NOT NULL
    -- "inserted_at" TIMESTAMP,
    -- "updated_at" TIMESTAMP
);

-- not used at all. speculatively useful for linking "samples" to "pattern_params"

CREATE TABLE "drum_type_lookup" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (2)
);

CREATE TABLE "steps" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INT REFERENCES "patterns" NOT NULL,
    "step" INT,
    "BD" INT,
    "SD" INT,
    "HH" INT
);

-- pattern_params for saving sample parameters. not yet implemented.

CREATE TABLE "pattern_params" (
    "id" SERIAL PRIMARY KEY,
    "pattern_id" INT REFERENCES "patterns" ON DELETE CASCADE,
    "drum_id" INT REFERENCES "drum_type_lookup",
    "param_volume" INT,
    "param_pitch" INT
);

INSERT INTO "drum_type_lookup" ("name")
    VALUES
    ('BD'),
    ('SD'),
    ('HH');

-- SEED SAMPLE_KITS

INSERT INTO "sample_kits" ("name","BD","SD","HH")
    VALUES
    ('TR808 1','BD.WAV','TOTAL_808_SAMPLE 9_S08.WAV','TOTAL_808_SAMPLE 17_S16.WAV'),
    ('TR808 2','TOTAL_808_SAMPLE 26_S25.WAV','TOTAL_808_SAMPLE 11_S10.WAV','TOTAL_808_SAMPLE 23_S22.WAV'),
    ('concrete 1','ghost_bass2.WAV','ice_snare1.WAV','metalHH2.WAV'),
    ('concrete 2','ghost_bass1.WAV','metalsnare2.WAV','metalHH1.WAV');