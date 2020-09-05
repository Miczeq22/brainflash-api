import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('card').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('card', (table) => {
        table.uuid('id').notNullable();
        table.uuid('deck_id').notNullable();
        table.text('question').notNullable();
        table.text('answer').notNullable();
        table.timestamp('created_at').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('card').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('card');
    }
  });
}
