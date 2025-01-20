// models/Vendor.js
const BaseModel = require('./BaseModel');
const ProductToVendor = require('./ProductToVendor');

class Vendor extends BaseModel {
  static get tableName() {
    return 'vendors';
  }

  static get relationMappings() {
    return {
      productToVendors: {
        relation: BaseModel.HasManyRelation,
        modelClass: ProductToVendor,
        join: {
          from: 'vendors.vendor_id',
          to: 'product_to_vendor.vendor_id',
        },
      },
    };
  }
}

module.exports = Vendor;
