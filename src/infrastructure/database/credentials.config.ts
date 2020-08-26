require('dotenv').config();

export interface DatabaseConfig {
  database?: string;
  host?: string;
  password?: string;
  user?: string;
  port?: number;
}

export const postgresConfig: DatabaseConfig = {
  database: process.env.POSTGRES_DB,
  host: process.env.POSTRGRES_HOSTNAME,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  port: Number(process.env.POSTGRES_PORT),
};
