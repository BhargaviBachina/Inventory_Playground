// mysql/migrations/xxxx_create_product_to_vendor_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('product_to_vendor', (table) => {
      table.increments('product_to_vendor_id').primary();
      table.integer('vendor_id').unsigned().references('vendor_id').inTable('vendors').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('product_id').inTable('products').onDelete('CASCADE');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('product_to_vendor');
  };
  