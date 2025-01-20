// mysql/migrations/xxxx_create_users_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('users', (table) => {
      table.increments('user_id').primary();
      table.string('first_name').notNullable();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.string('email').notNullable().unique();
      table.string('profile_pic');
      table.string('thumbnail');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
  };
  