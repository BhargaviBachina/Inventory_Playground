// mysql/seeds/xxxx_insert_product_category.js
exports.seed = async function (knex) {
  await knex('product_category').del(); // Clear existing entries
  await knex.raw('ALTER TABLE product_category AUTO_INCREMENT = 1');
  // Fetch all product and category IDs
  const products = await knex('products').select('product_id');
  const categories = await knex('categories').select('category_id');
  
  const productCategoryMappings = [];
  
  // Create relations for every combination of product and category
  products.forEach(product => {
    categories.forEach(category => {
      productCategoryMappings.push({
        product_id: product.product_id,
        category_id: category.category_id
      });
    });
  });

  // Insert all product-category mappings at once
  await knex('product_category').insert(productCategoryMappings);
};
