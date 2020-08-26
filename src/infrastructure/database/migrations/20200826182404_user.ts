import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.hasTable('user').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('user', (table) => {
        table.uuid('id').notNullable();
        table.string('email').notNullable();
        table.text('password').notNullable();
        table.string('username').notNullable();
        table.string('account_status').notNullable();
        table.timestamp('registration_date').notNullable();
        table.timestamp('confirmation_date');
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.hasTable('user').then((exists) => {
    if (exists) {
      return knex.schema.dropTable('user');
    }
  });
}
