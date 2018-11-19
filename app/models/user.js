// The User model.
'use strict';

var Sequelize = require('sequelize'),
bcrypt = require('bcryptjs');

var config = require('../config'),
db = require('../services/database');

// 1: The model schema.
var modelDefinition = {
  id: {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  },

  role: {
    type: Sequelize.INTEGER,
    defaultValue: config.userRoles.user
  },

  isFlagged: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
};

// 2: The model options.
var modelOptions = {
  instanceMethods: {
    comparePasswords: comparePasswords
  },
  hooks: {
    beforeValidate: hashPassword
  }
};

// 3: Define the User model.
var UserModel = db.define('user', modelDefinition, modelOptions);

// Compares two passwords.
function comparePasswords(password, callback) {
  bcrypt.compare(password, this.password, function(error, isMatch) {
    if(error) {
      return callback(error);
    }

    return callback(null, isMatch);
  });
}

// Hashes the password for a user object.
function hashPassword(user) {
  if(user.changed('password')) {
    return bcrypt.hash(user.password, 10).then(function(password) {
      user.password = password;
    });
  }
}

var toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email
    };
};

module.exports = UserModel;
