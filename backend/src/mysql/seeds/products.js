// mysql/seeds/xxxx_insert_products.js

exports.seed = async function (knex) {
  // Clear existing entries
  await knex('products').del();

  // Reset the auto-increment counter to 1
  await knex.raw('ALTER TABLE products AUTO_INCREMENT = 1');

  // Create the products array with manually set statuses
  const products = [
    { product_name: 'Maggie Noodles', category_id: 1, quantity_in_stock: 100, unit_price: 15.00, product_image: '', status: 1 },
    { product_name: 'Chocolate Bar', category_id: 2, quantity_in_stock: 200, unit_price: 50.00, product_image: '', status: 1 },
    { product_name: 'UX Toolkit', category_id: 3, quantity_in_stock: 30, unit_price: 200.00, product_image: '', status: 0 },  // Manually set to 'not available'
    { product_name: 'UI Template', category_id: 4, quantity_in_stock: 50, unit_price: 500.00, product_image: '', status: 1 },
    { product_name: 'Full-stack Handbook', category_id: 5, quantity_in_stock: 40, unit_price: 300.00, product_image: '', status: 99 },  // Manually set to 'deleted'
    { product_name: 'DevOps Essentials', category_id: 6, quantity_in_stock: 20, unit_price: 250.00, product_image: '', status: 1 },
    { product_name: 'SQL Guide', category_id: 7, quantity_in_stock: 70, unit_price: 100.00, product_image: '', status: 1 },
    { product_name: 'System Utilities Pack', category_id: 8, quantity_in_stock: 60, unit_price: 150.00, product_image: '', status: 0 },  // Manually set to 'not available'
    { product_name: 'Mobile App Starter Kit', category_id: 9, quantity_in_stock: 25, unit_price: 400.00, product_image: '', status: 1 },
    { product_name: 'Productivity Planner', category_id: 10, quantity_in_stock: 100, unit_price: 30.00, product_image: '', status: 1 },
    { product_name: 'JavaScript Framework Guide', category_id: 1, quantity_in_stock: 50, unit_price: 120.00, product_image: '', status: 1 },
    { product_name: 'Node.js Course', category_id: 2, quantity_in_stock: 35, unit_price: 150.00, product_image: '', status: 1 },
    { product_name: 'UI Design Guide', category_id: 4, quantity_in_stock: 45, unit_price: 250.00, product_image: '', status: 99 },  // Manually set to 'deleted'
    { product_name: 'Cloud Deployment Manual', category_id: 6, quantity_in_stock: 20, unit_price: 350.00, product_image: '', status: 1 },
    { product_name: 'Database Indexing Tips', category_id: 7, quantity_in_stock: 40, unit_price: 200.00, product_image: '', status: 1 },
    { product_name: 'System Monitoring Tools', category_id: 8, quantity_in_stock: 55, unit_price: 175.00, product_image: '', status: 1 },
    { product_name: 'Android Development Guide', category_id: 9, quantity_in_stock: 30, unit_price: 250.00, product_image: '', status: 1 },
    { product_name: 'QA Testing Strategies', category_id: 11, quantity_in_stock: 45, unit_price: 125.00, product_image: '', status: 0 },  // Manually set to 'not available'
    { product_name: 'Project Management Basics', category_id: 12, quantity_in_stock: 40, unit_price: 150.00, product_image: '', status: 1 },
    { product_name: 'Technical Writing Tips', category_id: 13, quantity_in_stock: 35, unit_price: 100.00, product_image: '', status: 1 },
    { product_name: 'Data Analysis Workbook', category_id: 14, quantity_in_stock: 50, unit_price: 180.00, product_image: '', status: 1 },
    { product_name: 'Cybersecurity Essentials', category_id: 15, quantity_in_stock: 25, unit_price: 300.00, product_image: '', status: 1 },
    { product_name: 'Website Templates', category_id: 16, quantity_in_stock: 60, unit_price: 500.00, product_image: '', status: 1 },
    { product_name: 'Creative Design Pack', category_id: 17, quantity_in_stock: 50, unit_price: 350.00, product_image: '', status: 1 },
    { product_name: 'Agile Development Guide', category_id: 18, quantity_in_stock: 40, unit_price: 200.00, product_image: '', status: 1 },
    { product_name: 'Networking Basics', category_id: 19, quantity_in_stock: 55, unit_price: 175.00, product_image: '', status: 0 },  // Manually set to 'not available'
    { product_name: 'Support Manual', category_id: 20, quantity_in_stock: 65, unit_price: 100.00, product_image: '', status: 1 },
    { product_name: 'Advanced JavaScript', category_id: 1, quantity_in_stock: 30, unit_price: 250.00, product_image: '', status: 1 },
    { product_name: 'Express.js Guide', category_id: 2, quantity_in_stock: 40, unit_price: 200.00, product_image: '', status: 1 },
    { product_name: 'UI Animations Pack', category_id: 4, quantity_in_stock: 30, unit_price: 150.00, product_image: '', status: 99 },  // Manually set to 'deleted'
    { product_name: 'Docker Essentials', category_id: 6, quantity_in_stock: 25, unit_price: 300.00, product_image: '', status: 1 },
    { product_name: 'Data Optimization Manual', category_id: 7, quantity_in_stock: 20, unit_price: 400.00, product_image: '', status: 1 },
    { product_name: 'OS Management Tools', category_id: 8, quantity_in_stock: 50, unit_price: 250.00, product_image: '', status: 1 },
    { product_name: 'iOS Development Guide', category_id: 9, quantity_in_stock: 30, unit_price: 450.00, product_image: '', status: 0 },  // Manually set to 'not available'
    { product_name: 'Advanced QA Techniques', category_id: 11, quantity_in_stock: 20, unit_price: 300.00, product_image: '', status: 1 },
    { product_name: 'Leadership Skills Guide', category_id: 12, quantity_in_stock: 30, unit_price: 220.00, product_image: '', status: 1 },
    { product_name: 'Effective Writing Manual', category_id: 13, quantity_in_stock: 35, unit_price: 150.00, product_image: '', status: 1 },
    { product_name: 'Data Visualization Tools', category_id: 14, quantity_in_stock: 25, unit_price: 250.00, product_image: '', status: 1 },
    { product_name: 'Cyber Threat Analysis', category_id: 15, quantity_in_stock: 40, unit_price: 300.00, product_image: '', status: 1 },
    { product_name: 'Responsive Design Kit', category_id: 16, quantity_in_stock: 30, unit_price: 400.00, product_image: '', status: 1 }
  ];

  // Insert the products into the database
  await knex('products').insert(products);
};
