import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('deck', (table) => {
        table.uuid('id').notNullable();
        table.string('name').notNullable();
        table.text('description').notNullable();
        table.text('image_url');
        table.uuid('owner_id').notNullable();
        table.timestamp('created_at').notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('deck').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('deck');
    }
  });
}
