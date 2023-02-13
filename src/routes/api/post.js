require('dotenv').config();
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const api = process.env.API_URL || req.headers.host;

  const data = req.body;
  const user = req.user;
  const contentType = req.headers['content-type'];
  logger.debug(`Fragment content type is ${contentType}`);
  try {
    const fragment = new Fragment({ ownerId: user, type: contentType });
    await fragment.save();
    await fragment.setData(data);
    res.setHeader('Content-type', fragment.type);
    res.setHeader('Location', api + '/v1/fragments/' + fragment.id);
    res.status(200).json(createSuccessResponse({ fragment }));
    logger.info('Successfully created fragment');
  } catch (err) {
    logger.warn(err.message, 'Failed to create fragment');
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
