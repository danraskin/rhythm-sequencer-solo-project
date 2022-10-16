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
    const sqlQuery = `
      SELECT * FROM "steps"
        WHERE pattern_id = $1;
    `;


    // JOIN TO GET KIT NUMBER
    try {
        const stepsRes = await pool.query(sqlQuery,[patternId]);
        res.send(stepsRes.rows);
    } catch (dbErr) {
        console.log('GET steps/:id error: ', dbErr);
        res.sendStatus(500);
    }
});

module.exports = router;
