import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck_rating').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('deck_rating', (table) => {
        table.uuid('id').notNullable();
        table.uuid('user_id').notNullable();
        table.uuid('deck_id').notNullable();
        table.integer('rating').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck_rating').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('deck_rating');
    }
  });
}
