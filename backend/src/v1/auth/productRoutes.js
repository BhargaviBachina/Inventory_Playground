const express = require('express');
const router = express.Router();
const { fetchProductDetails, updateProductDetails, deleteProduct, generateProductPDF } = require('../auth/productController');
const { uploadProductImage } = require('../../aws/s3/s3.service'); // Import the upload middleware
const db = require('../../../config/db'); // Import knex to interact with your database

// Route to get product details with search and filtering
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 15;

  // Validate page and size parameters
  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: 'Invalid page number' });
  }
  if (isNaN(size) || size < 1) {
    return res.status(400).json({ error: 'Invalid page size' });
  }

  // Extract filters from query params
  const filters = {
    search: req.query.search || '', // Search term for product name, category, vendor
    productName: req.query.product_name || '',
    category: req.query.category || '',
    vendor: req.query.vendor || '',
    status: req.query.status || '',
    minQuantity: req.query.min_quantity ? parseInt(req.query.min_quantity) : undefined,
    maxQuantity: req.query.max_quantity ? parseInt(req.query.max_quantity) : undefined,
    minPrice: req.query.min_price ? parseFloat(req.query.min_price) : undefined,
    maxPrice: req.query.max_price ? parseFloat(req.query.max_price) : undefined
  };

  // Fetch product details with pagination and filters
  fetchProductDetails(page, size, filters)
    .then((products) => {
      res.status(200).json(products); // Send the response with the product details
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to fetch product details' });
    });
});



// Route to delete a product
router.delete('/:productId', (req, res) => {
  const productId = req.params.productId;
  deleteProduct(productId)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json({ error: 'Failed to delete product' }));
});

// Route to update product details (only the fields provided in the request)
router.put('/updateProduct/:productId', async (req, res) => {
  const productId = req.params.productId; // Get product ID from route parameter
  const updatedProductData = req.body; // Get the updated product data from request body

  try {
    // Call the function to update product details with only the fields provided
    const result = await updateProductDetails(productId, updatedProductData);

    // Send success response
    res.status(200).json(result);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product details' });
  }
});

// Route to upload product image and update product record
router.post('/upload-product-image', uploadProductImage.single('productImage'), (req, res) => {
  // req.file contains the information of the uploaded file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = req.file.location; // S3 URL of the uploaded image

  // Assuming you pass productId in the form-data
  const productId = req.body.productId;  // The product ID should be provided in the request body

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Update the product's product_image field in the database
  db('products')
    .where('product_id', productId)
    .update({
      product_image: imageUrl, // Save the S3 URL of the uploaded image
    })
    .then(() => {
      res.status(200).json({
        message: 'Product image uploaded and updated successfully',
        imageUrl: imageUrl, // Return the image URL
      });
    })
    .catch((err) => {
      console.error('Error updating product image:', err);
      res.status(500).json({ error: 'Failed to update product image in database' });
    });
});


module.exports = router;