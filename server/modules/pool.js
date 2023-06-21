const pg = require('pg');

let config = {};

if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    schema: 'rhythm_sequencer'
  };
} else {
  config = {
    host: 'localhost', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    database: 'rhythm_sequencer', // CHANGE THIS LINE! env var: PGDATABASE, this is likely the one thing you need to change to get up and running
    schema: 'rhythm_sequencer'
  };
}

pool.on('connect',(client)=> {
  client.query(`SET search_path TO ${config.schema}, public`);
});

// this creates the pool that will be shared by all other modules
const pool = new pg.Pool(config);

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;