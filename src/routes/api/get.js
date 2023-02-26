// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  try {
    var expand = false;
    if (req.query.expand === '1') {
      expand = true;
    } else if (Object.keys(req.query).length > 0) {
      const error = new Error('Invalid expand value');
      error.status = 400;
      throw error;
    }
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    res.status(400).json(createErrorResponse(404, error.message));
  }
};
