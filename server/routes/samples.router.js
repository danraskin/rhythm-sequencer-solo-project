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
        res.send(dbRes.rows)
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
