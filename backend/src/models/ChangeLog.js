// models/ChangeLog.js
const BaseModel = require('./BaseModel');

class ChangeLog extends BaseModel {
  static get tableName() {
    return 'change_log';
  }
}

module.exports = ChangeLog;
