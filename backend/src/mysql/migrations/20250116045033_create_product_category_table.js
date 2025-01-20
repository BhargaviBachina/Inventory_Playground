exports.up = async function (knex) {
    await knex.schema.createTable('product_category', (table) => {
      table.increments('id').primary(); // Optional, useful for tracking records
      table.integer('product_id').unsigned().notNullable();
      table.foreign('product_id').references('product_id').inTable('products').onDelete('CASCADE');
      table.integer('category_id').unsigned().notNullable();
      table.foreign('category_id').references('category_id').inTable('categories').onDelete('CASCADE');
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = async function (knex) {
    return knex.schema.dropTableIfExists('product_category');
  };
  