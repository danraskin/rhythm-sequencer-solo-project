const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', async (req, res) => {
    console.log('in GET /samples');
    try {
        const dbRes = await pool.query(`SELECT * FROM "sample_kits";`);

        const samples = {
            1: {
                name: dbRes.rows[0].name,
                BD: dbRes.rows[0].BD,
                SD: dbRes.rows[0].SD,
                HH: dbRes.rows[0].HH
            },
            2: {
                name: dbRes.rows[1].name,
                BD: dbRes.rows[1].BD,
                SD: dbRes.rows[1].SD,
                HH: dbRes.rows[1].HH
            }
        }
        // this duplication is not ideal, but it allows me to map the array on render
        // AND select sample in createGrid
        res.send({ 
            samplesArr: dbRes.rows,
            samplesObj: samples
        })
    } catch(dbErr) {
        console.log ('GET /samples error: ',dbErr);
        res.sendStatus(500);
    }
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
