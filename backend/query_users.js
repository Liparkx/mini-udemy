const { Client } = require('pg');

const client = new Client({
  host: 'nest-db.czy0ym4y6y6d.us-east-2.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'Fpa996552315',
  database: 'nestjs_tasks',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => client.query('SELECT username, "passwordHash", role FROM "users"'))
  .then(res => {
    console.table(res.rows);
    client.end();
  })
  .catch(err => {
    console.error('Error querying users:', err.message);
    client.end();
  });
