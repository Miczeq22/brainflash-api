import * as Knex from 'knex';
import { DatabaseConfig, postgresConfig } from './credentials.config';

export interface QueryBuilder extends Knex {}

export type DatabaseClient = 'pg';

export const createQueryBuilder = (client: DatabaseClient, config: DatabaseConfig) =>
  Knex.default({
    client,
    connection: config,
  });

export const postgresQueryBuilder = createQueryBuilder('pg', postgresConfig);
