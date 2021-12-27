const AdminBroMongoose = require('admin-bro-mongoose');
const { default: AdminBro } = require('admin-bro');
AdminBro.registerAdapter(AdminBroMongoose);

const Road = require('../models/roadModel');
const options = {
  resources: [Road],
};

module.exports = options;
