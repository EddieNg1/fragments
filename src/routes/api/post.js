require('dotenv').config();
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res, next) => {
  const api = process.env.API_URL || req.headers.host;

  const data = req.body;
  const user = req.user;
  const contentType = req.headers['content-type'];
  logger.debug(`Fragment content type is ${contentType}`);
  try {
    if (!Buffer.isBuffer(data)) {
      const error = new Error(`Unsupported media type, got ${contentType}`);
      error.status = 415;
      throw error;
    }
    const fragment = new Fragment({
      ownerId: user,
      type: contentType,
    });
    await fragment.save();
    await fragment.setData(data);

    logger.info('Successfully created fragment');
    res.setHeader('Location', `${api}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
  } catch (error) {
    next(error);
  }
};
