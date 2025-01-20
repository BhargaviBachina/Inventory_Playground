// mysql/seeds/xxxx_insert_product_to_vendor.js

exports.seed = async function (knex) {
  // Clear existing entries
  await knex('product_to_vendor').del();
  await knex.raw('ALTER TABLE product_to_vendor AUTO_INCREMENT = 1');
  // Fetch existing product IDs and vendor IDs
  const products = await knex('products').select('product_id');
  const vendors = await knex('vendors').select('vendor_id');

  // Prepare seed entries
  const productToVendorData = [];
  
  products.forEach((product) => {
    // Assign each product to at least one random vendor (and up to 6 vendors)
    const assignedVendors = new Set();

    // Randomly decide the number of vendors to assign (between 1 and 6 vendors per product)
    const numberOfVendors = Math.floor(Math.random() * 6) + 1; // Minimum 1 vendor, maximum 6 vendors

    while (assignedVendors.size < numberOfVendors) {
      const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
      assignedVendors.add(randomVendor.vendor_id);
    }

    // Create entries for each product-vendor pair
    assignedVendors.forEach((vendorId) => {
      productToVendorData.push({
        product_id: product.product_id,
        vendor_id: vendorId,
        status: 1, // Assuming active status
      });
    });
  });

  // Insert seed entries
  await knex('product_to_vendor').insert(productToVendorData);
};
