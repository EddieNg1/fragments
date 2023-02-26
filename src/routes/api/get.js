// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  var expand = false;
  if (!req.query.expand.length || req.query.expand != '1') {
    const error = new Error('Invalid expand query');
    error.status = 400;
    throw error;
  } else {
    expand = true;
  }
  const fragments = await Fragment.byUser(req.user, expand);
  res.status(200).json(createSuccessResponse({ fragments }));
};
