import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Railway DATABASE_URL kullanımı (öncelikli)
const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool(
  databaseUrl
    ? {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false, // Railway için gerekli
        },
      }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

pool.on('connect', () => {
  console.log('✅ PostgreSQL veritabanına bağlandı');
  console.log(`🔗 Database: ${process.env.DB_NAME || 'railway'}`);
});

pool.on('error', (err: Error) => {
  console.error('❌ PostgreSQL bağlantı hatası:', err);
  process.exit(-1);
});

export const query = <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

export { pool };
