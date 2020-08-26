import { postgresQueryBuilder } from './query-builder';

describe('[Infrastructure] Postgres Query Builder', () => {
  test('should create knex query builder', () => {
    expect(postgresQueryBuilder).toMatchInlineSnapshot('[Function]');
  });

  test('should query database by query builder', async () => {
    const response = await postgresQueryBuilder.raw('SELECT 1');

    expect(response.command).toEqual('SELECT');
  });
});
