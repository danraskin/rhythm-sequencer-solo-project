const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

//POST steps
// router.put('/', async (req, res) => {
  

//     try {
   

//     } catch (dbErr) {
//         console.log('PUT /step error: ', dbErr);
//         res.sendStatus(500);
//     }
// });

router.get('/:id', async (req, res) => {
    console.log('in GET steps/id');
    const patternId = req.params.id;
    const sqlQueryKitId = `SELECT "kit_id", "steps_total", "name" from "patterns" where id = $1;`;
    // const sqlQueryKit = `SELECT * from "sample_kits" where id = $1;`;
    const sqlQuerySteps = `SELECT * FROM "steps" WHERE pattern_id = $1;`;

    try {
        const kitIdRes = await pool.query(sqlQueryKitId,[patternId]);
        console.log(kitIdRes);
        // const kitRes = await pool.query(sqlQueryKit,[kitIdRes.rows[0].kit_id])
        // console.log(kitRes);
        const stepsRes = await pool.query(sqlQuerySteps,[patternId]);
        res.send({
            kit_id: kitIdRes.rows[0].kit_id,
            steps_total: kitIdRes.rows[0].steps_total,
            name: kitIdRes.rows[0].name,
            grid: stepsRes.rows
        });
    } catch (dbErr) {
        console.log('GET steps/:id error: ', dbErr);
        res.sendStatus(500);
    }
});

module.exports = router;
