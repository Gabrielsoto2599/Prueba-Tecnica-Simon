import { Pool } from 'pg';

const pool = new Pool({
  user: 'gabriel_admin',
  host: 'localhost',
  database: 'soto_system_db',
  password: 'soto_password123',
  port: 5432,
});

export default pool;
