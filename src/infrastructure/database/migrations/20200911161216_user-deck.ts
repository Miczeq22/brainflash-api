import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('user_deck').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('user_deck', (table) => {
        table.uuid('id').notNullable();
        table.uuid('user_id').notNullable();
        table.uuid('deck_id').notNullable();
        table.timestamp('enrolled_at').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('user_deck').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('user_deck');
    }
  });
}
