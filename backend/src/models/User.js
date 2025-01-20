// models/User.js
const BaseModel = require('./BaseModel');
const ChangeLog = require('./ChangeLog');

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      changeLogs: {
        relation: BaseModel.HasManyRelation,
        modelClass: ChangeLog,
        join: {
          from: 'users.user_id',
          to: 'change_log.changed_by',
        },
      },
    };
  }
}

module.exports = User;
