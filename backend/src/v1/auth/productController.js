const db = require('../../../config/db');

// Function to fetch product details with filters (already provided)
const fetchProductDetails = async (page = 1, size = 15, filters = {}) => {
  try {
    const { 
      search, // Search term for product name, category, vendor
      productName, 
      category, 
      vendor, 
      status, 
      minQuantity,
      maxQuantity,
      minPrice,
      maxPrice
    } = filters;

    // Build the initial query
    let query = db('product_category')
      .join('products', 'product_category.product_id', '=', 'products.product_id')
      .join('categories', 'product_category.category_id', '=', 'categories.category_id')
      .join('product_to_vendor', 'products.product_id', '=', 'product_to_vendor.product_id')
      .join('vendors', 'product_to_vendor.vendor_id', '=', 'vendors.vendor_id')
      .select(
        'products.product_id',
        'products.product_name as name',
        'products.product_image as image_url',
        'products.status',
        'products.quantity_in_stock as quantity',
        'products.unit_price as unit',
        db.raw('GROUP_CONCAT(DISTINCT categories.category_name ORDER BY categories.category_name ASC) as categories'),
        db.raw('GROUP_CONCAT(DISTINCT vendors.vendor_name ORDER BY vendors.vendor_name ASC) as vendors')
      )
      .where('products.status', '!=', 99) // Exclude products with status 99
      .groupBy('products.product_id', 'products.product_name', 'products.product_image', 'products.status', 'products.quantity_in_stock', 'products.unit_price')
      .orderBy('products.product_name', 'asc');

    // Apply search (partial match) filters
    if (search) {
      query = query.andWhere(builder => {
        builder.where('products.product_name', 'like', `%${search}%`)
               .orWhereRaw('FIND_IN_SET(?, categories.category_name)', [search])
               .orWhereRaw('FIND_IN_SET(?, vendors.vendor_name)', [search]);
      });
    }

    // Apply product name filter
    if (productName) {
      query = query.andWhere('products.product_name', 'like', `%${productName}%`);
    }

    // Apply category filter
    if (category) {
      query = query.andWhereRaw('FIND_IN_SET(?, categories.category_name)', [category]);
    }

    // Apply vendor filter
    if (vendor) {
      query = query.andWhereRaw('FIND_IN_SET(?, vendors.vendor_name)', [vendor]);
    }

    // Apply status filter
    if (status) {
      query = query.andWhere('products.status', '=', status);
    }

    // Apply quantity filters
    if (minQuantity !== undefined) {
      query = query.andWhere('products.quantity_in_stock', '>=', minQuantity);
    }
    if (maxQuantity !== undefined) {
      query = query.andWhere('products.quantity_in_stock', '<=', maxQuantity);
    }

    // Apply price filters
    if (minPrice !== undefined) {
      query = query.andWhere('products.unit_price', '>=', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.andWhere('products.unit_price', '<=', maxPrice);
    }

    // Execute the query
    const data = await query;

    // Flatten the product-category combinations
    const flattenedData = data.flatMap(product => {
      const categories = product.categories.split(',');
      const vendors = product.vendors.split(',');

      return categories.map(category => ({
        product_id: product.product_id,
        product_name_and_image: {
          name: product.name,
          image: product.image_url || ''
        },
        status: product.status,
        quantity: product.quantity,
        unit: product.unit,
        category: category,
        vendors: vendors
      }));
    });

    // Pagination logic
    const offset = (page - 1) * size;
    const paginatedData = flattenedData.slice(offset, offset + size);

    const totalCategoryProductCombinations = flattenedData.length;
    const totalPages = Math.ceil(totalCategoryProductCombinations / size);

    return {
      products: paginatedData,
      totalCategoryProductCombinations,
      totalPages,
      currentPage: page,
      pageSize: size
    };

  } catch (err) {
    console.error('Error fetching product details:', err);
    throw new Error(`Failed to fetch product details: ${err.message}`);
  }
};

// Function to delete a product by ID
const deleteProduct = async (productId) => {
  try {
    await db('products').where('product_id', productId).del();
    await db('product_category').where('product_id', productId).del();
    await db('product_to_vendor').where('product_id', productId).del();

    return { message: 'Product deleted successfully' };
  } catch (err) {
    console.error('Error deleting product:', err);
    throw new Error('Failed to delete product');
  }
};

// Function to update specific product details (only fields provided in the request)
const updateProductDetails = async (productId, updatedProductData) => {
  try {
    // Prepare an object to hold the fields to be updated
    let updatedFields = {};

    // Check which fields are provided and add them to the updatedFields object
    if (updatedProductData.product_name) updatedFields.product_name = updatedProductData.product_name;
    if (updatedProductData.status !== undefined) updatedFields.status = updatedProductData.status;
    if (updatedProductData.quantity_in_stock !== undefined) updatedFields.quantity_in_stock = updatedProductData.quantity_in_stock;
    if (updatedProductData.unit_price !== undefined) updatedFields.unit_price = updatedProductData.unit_price;

    // Update product details in the 'products' table, but only the fields that were provided
    await db('products')
      .where('product_id', productId)
      .update(updatedFields);

    // If vendors are provided, update the product-vendor relationships
    if (updatedProductData.vendors && updatedProductData.vendors.length > 0) {
      // First, delete existing vendor relationships for the product
      await db('product_to_vendor').where('product_id', productId).del();

      // Insert the new vendors
      const vendorData = updatedProductData.vendors.map((vendorId) => ({
        product_id: productId,
        vendor_id: vendorId, // Assuming vendor is the vendor ID
      }));
      await db('product_to_vendor').insert(vendorData);
    }

    return { message: 'Product updated successfully' };
  } catch (err) {
    console.error('Error updating product details:', err);
    throw new Error(`Failed to update product: ${err.message}`);
  }
};

module.exports = { fetchProductDetails, deleteProduct, updateProductDetails};
