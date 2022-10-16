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
    const patternId = req.params.id;
    const sqlQueryKit = `SELECT "kit_id" from "patterns" where id = $1;`;
    const sqlQuerySteps = `SELECT * FROM "steps" WHERE pattern_id = $1;`;

    try {
        const kitRes = await pool.query(sqlQueryKit,[patternId]);
        const stepsRes = await pool.query(sqlQuerySteps,[patternId]);
        res.send({
            kit_id: kitRes.rows[0].kit_id,
            grid: stepsRes.rows
        });
    } catch (dbErr) {
        console.log('GET steps/:id error: ', dbErr);
        res.sendStatus(500);
    }
});

module.exports = router;
