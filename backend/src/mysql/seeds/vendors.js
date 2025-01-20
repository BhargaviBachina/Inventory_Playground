exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('vendors').del();

  // Insert seed entries
  await knex('vendors').insert([
    {
      vendor_name: 'Zepto',
      contact_name: 'John Doe',
      address: '123 Zepto St.',
      city: 'Mumbai',
      postal_code: '400001',
      country: 'India',
      phone: '+91 9876543210',
      status: 1,
    },
    {
      vendor_name: 'Blinkit',
      contact_name: 'Jane Smith',
      address: '456 Blinkit Ave.',
      city: 'Bengaluru',
      postal_code: '560001',
      country: 'India',
      phone: '+91 9876543211',
      status: 1,
    },
    {
      vendor_name: 'Swiggy',
      contact_name: 'Raj Kumar',
      address: '789 Swiggy Road',
      city: 'Chennai',
      postal_code: '600001',
      country: 'India',
      phone: '+91 9876543212',
      status: 1,
    },
    {
      vendor_name: 'BigBasket',
      contact_name: 'Ankit Verma',
      address: '101 BigBasket Blvd',
      city: 'Hyderabad',
      postal_code: '500001',
      country: 'India',
      phone: '+91 9876543213',
      status: 1,
    },
    {
      vendor_name: 'Dunzo',
      contact_name: 'Shreya Shah',
      address: '202 Dunzo Lane',
      city: 'Delhi',
      postal_code: '110001',
      country: 'India',
      phone: '+91 9876543214',
      status: 1,
    },
    {
      vendor_name: 'Zomato',
      contact_name: 'Vikram Singh',
      address: '303 Zomato Street',
      city: 'Kolkata',
      postal_code: '700001',
      country: 'India',
      phone: '+91 9876543215',
      status: 1,
    },
  ]);
};
