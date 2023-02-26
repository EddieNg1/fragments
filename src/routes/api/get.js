// src/routes/api/get.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  var expand = false;
  try {
    if (req.query.expand !== '1') {
      const error = new Error('Invalid expand query');
      error.status = 400;
      throw error;
    } else {
      expand = true;
    }
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    throw new Error('Error getting fragments for current user');
  }
};
