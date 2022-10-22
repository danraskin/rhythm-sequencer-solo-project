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
        console.log(dbRes.rows);
        const keys = dbRes.rows.length;
        const samples = {};
        for (i = 0; i < keys; i++) {
            samples[i+1] = {
                    name: dbRes.rows[i].name,
                    BD: dbRes.rows[i].BD,
                    SD: dbRes.rows[i].SD,
                    HH: dbRes.rows[i].HH
                }
            }
        console.log(samples);
     //duplication of samples into array and object allows use of samples for menu rendering and drumkit creation 
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
