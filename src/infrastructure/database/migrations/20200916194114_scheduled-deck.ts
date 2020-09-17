import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('scheduled_deck').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('scheduled_deck', (table) => {
        table.uuid('id').notNullable();
        table.uuid('user_id').notNullable();
        table.uuid('deck_id').notNullable();
        table.uuid('owner_id').notNullable();
        table.timestamp('scheduled_date').notNullable();
        table.timestamp('scheduled_at').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('scheduled_deck').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('scheduled_deck');
    }
  });
}
