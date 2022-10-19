const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//POST new pattern
router.post('/', async (req, res) => {
    console.log('in POST /patterns', req.body);
    const name = req.body.name;
    const kit_id = req.body.kit_id;
    const user_id=req.body.user;
    const steps_total = req.body.steps_total;
    const pattern = req.body.pattern;

    const sqlQueryPattern = `
        INSERT INTO "patterns" ("user_id","kit_id","steps_total","name")
            VALUES ($1,$2,$3,$4)
            RETURNING id;
        `;
    const sqlQuerySteps = `
        INSERT INTO "steps" ("pattern_id","step","BD","SD","HH")
            VALUES ($1,$2,$3,$4,$5);
        `;

    try {
   
        const patternRes = await pool.query(sqlQueryPattern, [user_id,kit_id,steps_total,name]);
        const patternId = patternRes.rows[0].id;

        for ( let i=0; i < steps_total; i ++ ) {
            //loops through an array of length equal to number of steps. sql query called for each step in sequence.
            await pool.query( sqlQuerySteps,
                [
                    patternId,
                    i,
                    pattern.BD[i],
                    pattern.SD[i],
                    pattern.HH[i]
                ]
            )
        } 
        res.sendStatus(201);

    } catch (dbErr) {
        console.log('POST /patterns error: ', dbErr);
        res.sendStatus(500);
    }
});

router.put('/:id', async (req, res) => {
    console.log('in POST /patterns/id', req.params.id, req.body);
    const pattern_id = req.params.id
    const name = req.body.name;
    const kit_id = req.body.kit_id;
    const steps_total = req.body.steps_total; //will need to adjust if users can edit pattern length
    const pattern = req.body.pattern;

    const sqlQueryPattern = `
        UPDATE "patterns"
            SET
                "kit_id" = $1,
                "name" = $2
            WHERE id=$3;
        `;
    const sqlQuerySteps = `
        UPDATE "steps"
            SET
                "BD" = $1,
                "SD" = $2,
                "HH" = $3
            WHERE "pattern_id" = $4 AND "step" = $5;
        `;

    try {
   
        await pool.query(sqlQueryPattern, [kit_id, name,pattern_id]);

        for ( let i=0; i < steps_total; i ++ ) {
            //loops through an array of length equal to number of steps. sql query called for each step in sequence.
            await pool.query( sqlQuerySteps,
                [
                    pattern.BD[i],
                    pattern.SD[i],
                    pattern.HH[i],
                    pattern_id,
                    i
                ]
            )
        } 
        res.sendStatus(201);

    } catch (dbErr) {
        console.log('POST /patterns error: ', dbErr);
        res.sendStatus(500);
    }
});






router.get('/user', async (req, res) => {
    const sqlQuery = `
      SELECT * FROM "patterns" WHERE user_id = $1;
    `;
    try {
        const patternsRes = await pool.query(sqlQuery,[req.user.id])
        res.send(patternsRes.rows);
    } catch (dbErr) {
        console.log('GET /patterns/user');
        res.sendStatus(500);
    }
});

module.exports = router;
