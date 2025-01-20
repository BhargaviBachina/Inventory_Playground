// mysql/migrations/xxxx_create_products_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('products', (table) => {
      table.increments('product_id').primary();
      table.string('product_name').notNullable();
      table.integer('category_id').unsigned().notNullable();
      table.foreign('category_id').references('category_id').inTable('categories').onDelete('CASCADE');
      table.integer('quantity_in_stock').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.string('product_image');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('products');
  };
  