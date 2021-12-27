const express = require('express');
const { default: AdminBro } = require('admin-bro');
const { buildRouter } = require('admin-bro-expressjs');

const buildAdminRouter = (admin) => {
  const router = buildRouter(admin);
  return router;
};

module.exports = buildAdminRouter;
