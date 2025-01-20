// mysql/migrations/xxxx_create_categories_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('categories', (table) => {
      table.increments('category_id').primary();
      table.string('category_name').notNullable().unique();
      table.text('description');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('categories');
  };
  