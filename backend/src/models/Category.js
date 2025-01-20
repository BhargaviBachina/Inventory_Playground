const BaseModel = require('./BaseModel');
const Category = require('./Category');
const ProductToVendor = require('./ProductToVendor');

class Product extends BaseModel {
  static get tableName() {
    return 'products';
  }

  static get relationMappings() {
    return {
      categories: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Category,
        join: {
          from: 'products.product_id',
          through: {
            from: 'product_category.product_id',
            to: 'product_category.category_id',
          },
          to: 'categories.category_id',
        },
      },
      productToVendors: {
        relation: BaseModel.HasManyRelation,
        modelClass: ProductToVendor,
        join: {
          from: 'products.product_id',
          to: 'product_to_vendor.product_id',
        },
      },
    };
  }
}

module.exports = Product;