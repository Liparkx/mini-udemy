const { Client } = require('pg');

const client = new Client({
  host: 'nest-db.czy0ym4y6y6d.us-east-2.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'Fpa996552315',
  database: 'nestjs_tasks',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  const tables = ['users', 'courses', 'modules', 'lessons', 'enrollment', 'progress'];

  for (const table of tables) {
    try {
      const res = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);
      console.log(`\n====== TABLE: ${table.toUpperCase()} ======`);
      console.table(res.rows);
    } catch (e) {
      console.log(`Tabela "${table}" não encontrada.`);
    }
  }

  await client.end();
}

run().catch(console.error);
