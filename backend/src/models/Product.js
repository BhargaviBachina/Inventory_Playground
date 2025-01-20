const BaseModel = require('./BaseModel');
const Product = require('./Product');

class Category extends BaseModel {
  static get tableName() {
    return 'categories';
  }

  static get relationMappings() {
    return {
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'categories.category_id',
          through: {
            from: 'product_category.category_id',
            to: 'product_category.product_id',
          },
          to: 'products.product_id',
        },
      },
    };
  }
}

module.exports = Category;