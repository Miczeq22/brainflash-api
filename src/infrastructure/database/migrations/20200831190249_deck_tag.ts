import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck_tag').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('deck_tag', (table) => {
        table.uuid('id').notNullable();
        table.uuid('deck_id').notNullable();
        table.uuid('tag_id').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck_tag').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('deck_tag');
    }
  });
}
