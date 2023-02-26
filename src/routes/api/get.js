// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var expand = false;
  try {
    if (
      Object.keys(req.query).length > 0 &&
      (!req.query.expand.length || req.query.expand !== '1')
    ) {
      const error = new Error('Invalid expand query');
      error.status = 400;
      throw error;
    }
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    throw new Error('Error getting fragments for current user');
  }
};
