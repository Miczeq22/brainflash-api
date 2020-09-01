import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('tag').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('tag', (table) => {
        table.uuid('id').notNullable();
        table.string('name').notNullable();
        table.timestamp('created_at').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('tag').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('tag');
    }
  });
}
