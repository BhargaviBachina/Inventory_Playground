// mysql/migrations/xxxx_create_change_log_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('change_log', (table) => {
      table.increments('change_id').primary();
      table.string('table_name').notNullable();
      table.integer('record_id').notNullable();
      table.integer('changed_by').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
      table.timestamp('change_date').defaultTo(knex.fn.now());
      table.string('change_type').notNullable();
      table.json('old_value');
      table.json('new_value');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('change_log');
  };
  