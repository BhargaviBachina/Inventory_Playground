// mysql/seeds/xxxx_insert_categories.js

exports.seed = async function (knex) {
  await knex('categories').del();
  
  // Inserts seed entries
  await knex('categories').insert([
    { category_name: 'Frontend Developer', description: 'Develops the client-side of web applications', status: 1 },
    { category_name: 'Backend Developer', description: 'Develops the server-side, databases, and APIs', status: 1 },
    { category_name: 'UX Designer', description: 'Focuses on the overall user experience and usability', status: 1 },
    { category_name: 'UI Designer', description: 'Designs the user interface, including layout and visual elements', status: 1 },
    { category_name: 'Full-stack Developer', description: 'Works on both frontend and backend development', status: 1 },
    { category_name: 'DevOps Engineer', description: 'Works on the integration, deployment, and operations of the software', status: 1 },
    { category_name: 'Database Administrator', description: 'Manages and organizes data in databases', status: 1 },
    { category_name: 'System Administrator', description: 'Maintains and manages computer systems and networks', status: 1 },
    { category_name: 'Mobile Developer', description: 'Develops mobile applications for iOS and Android platforms', status: 1 },
    { category_name: 'Product Manager', description: 'Oversees the development and lifecycle of a product', status: 1 },
    { category_name: 'Quality Assurance (QA)', description: 'Ensures that the product meets the required quality standards', status: 1 },
    { category_name: 'Project Manager', description: 'Leads projects and ensures they are completed on time and within scope', status: 1 },
    { category_name: 'Technical Writer', description: 'Creates technical documentation and manuals', status: 1 },
    { category_name: 'Data Scientist', description: 'Analyzes data to uncover insights and inform business decisions', status: 1 },
    { category_name: 'Security Engineer', description: 'Works to protect systems and networks from cyber threats', status: 1 },
    { category_name: 'Web Designer', description: 'Designs the layout, visual appearance, and usability of websites', status: 1 },
    { category_name: 'Graphic Designer', description: 'Designs visual elements for digital and print media', status: 1 },
    { category_name: 'Software Engineer', description: 'Designs and develops software systems and applications', status: 1 },
    { category_name: 'Network Engineer', description: 'Manages and optimizes network infrastructure', status: 1 },
    { category_name: 'Support Specialist', description: 'Provides technical support and troubleshooting assistance', status: 1 }
  ]);
};
