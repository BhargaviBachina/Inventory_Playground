// mysql/migrations/xxxx_create_vendors_table.js
exports.up = async function (knex) {
    await knex.schema.createTable('vendors', (table) => {
      table.increments('vendor_id').primary();
      table.string('vendor_name').notNullable();
      table.string('contact_name');
      table.string('address');
      table.string('city');
      table.string('postal_code');
      table.string('country');
      table.string('phone');
      table.integer('status').defaultTo(0).notNullable();
      table.timestamps(true, true); // created_at and updated_at
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('vendors');
  };
  