DROP TABLE "user", "sample_kits", "patterns", "drum_type_lookup", "steps", "pattern_params" CASCADE;

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
    "user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "kit_id" INTEGER REFERENCES "sample_kits" NOT NULL,
    "name" VARCHAR (80), --NOT NULL,
    --"steps" INT NOT NULL,
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
    "BD" INT,
    "SD" INT,
    "HH" INT
);

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

-- seed user for DEMO
INSERT INTO "user" ("id", "username","password")
  VALUES
  ('1',	'dj deepfake',	'$2a$10$zs8LqxcAXtcXDUpqLrurHObQtZj35g1AXXhJ9gvNC58jrD5JyqIfq');

-- seed patterns for DEMO
INSERT INTO "patterns" ("id", "user_id", "kit_id", "name", "steps_total")
  VALUES
  ('1','1','3','SLICED','16'),
  ('2','1','2','sweetmeats','8'),
  ('3','1','1','rough sleep','8'),		
  ('4','1',	'4','junk','8');
	
-- seed steps for DEMO

INSERT INTO "steps" ("id", "pattern_id", "step", "BD", "SD", "HH")
	VALUES
('1','1','0','1','0','0'),
('2','1','1','0','1','0'),
('3','1','2','2','0','1'),
('4','1','3','2','2','0'),
('5','1','4','2','0','0'),
('6','1','5','0','0','1'),
('7','1','6','1','0','0'),
('8','1','7','0','0','0'),
('9','1','8','0','1','0'),
('10','1','9','2','1','0'),
('11','1','10','2','0','0'),
('12','1','11','0','0','0'),
('13','1','12','1','0','1'),
('14','1','13','0','1','0'),
('15','1','14','1','0','0'),
('16','1','15','0','0','0'),
('17','2','0','1','0','0'),
('18','2','1','0','0','2'),
('19','2','2','2','0','2'),
('20','2','3','1','0','0'),
('21','2','4','0','0','0'),
('22','2','5','0','0','1'),
('23','2','6','0','1','2'),
('24','2','7','0','0','0'),
('25','3','0','2','0','1'),
('26','3','1','2','0','2'),
('27','3','2','1','0','0'),
('28','3','3','2','0','1'),
('29','3','4','1','0','1'),
('30','3','5','0','2','1'),
('31','3','6','1','2','0'),
('32','3','7','2','0','1'),
('33','3','8','1','0','2'),
('34','3','9','0','1','0'),
('35','3','10','1','0','2'),
('36','3','11','0','0','1'),
('37','3','12','2','1','1'),
('38','3','13','1','1','1'),
('39','3','14','2','0','1'),
('40','3','15','1','0','0'),
('41','4','0','2','0','0'),
('42','4','1','2','2','0'),
('43','4','2','0','0','2'),
('44','4','3','2','1','1'),
('45','4','4','1','0','2'),
('46','4','5','0','0','0'),
('47','4','6','2','1','1'),
('48','4','7','0','0','0');
