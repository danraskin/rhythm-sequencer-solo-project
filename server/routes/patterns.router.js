const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();



//POST new pattern
router.post('/', async (req, res) => {
    console.log('in POST /patterns', req.body);
    const kit_id = req.body.kit_id;
    const user_id=req.body.user;
    const steps_total = req.body.steps_total;
    const pattern = req.body.pattern;

    const sqlQueryPattern = `
        INSERT INTO "patterns" ("user_id","kit_id","steps_total")
            VALUES ($1,$2,$3)
            RETURNING id;
        `;
    const sqlQuerySteps = `
        INSERT INTO "steps" ("pattern_id","step","BD","SD","HH")
            VALUES ($1,$2,$3,$4,$5);
        `;

    try {
   
        const patternRes = await pool.query(sqlQueryPattern, [user_id,kit_id,steps_total]);
        const patternId = patternRes.rows[0].id;

        //could make this concurrent, but the most data is going to be.... not v much.
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
        console.log('POST /patterns error: ', dbErr),
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
