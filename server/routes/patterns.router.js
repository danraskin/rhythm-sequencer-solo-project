const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.post('/', (req, res) => {
  console.log('in POST /samples', req.body);

//   const pattern = []
//   // do shit with req.body.
//   for (let row of req.body) {
//       console.log('row:',row);
//       for (let step in row) {
//           console.log(row[step]);
//       }
//   }

});

module.exports = router;
