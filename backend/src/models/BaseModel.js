// models/BaseModel.js
const { Model } = require('objection');

class BaseModel extends Model {
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  $beforeInsert() {
    const timestamp = new Date().toISOString();
    this.created_at = timestamp;
    this.updated_at = timestamp;
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = BaseModel;
