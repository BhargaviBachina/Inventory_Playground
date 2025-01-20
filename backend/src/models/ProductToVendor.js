// models/ProductToVendor.js
const BaseModel = require('./BaseModel');
const Product = require('./Product');
const Vendor = require('./Vendor');

class ProductToVendor extends BaseModel {
  static get tableName() {
    return 'product_to_vendor';
  }

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_to_vendor.product_id',
          to: 'products.product_id',
        },
      },
      vendor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Vendor,
        join: {
          from: 'product_to_vendor.vendor_id',
          to: 'vendors.vendor_id',
        },
      },
    };
  }
}

module.exports = ProductToVendor;
