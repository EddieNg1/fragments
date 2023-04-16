require('dotenv').config();
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res, next) => {
  const api = process.env.API_URL || req.headers.host;

  const data = req.body;
  const user = req.user;
  const contentType = req.headers['content-type'];
  logger.debug(`Fragment content type is ${contentType}`);
  if (Fragment.isSupportedType(req.get('Content-Type'))) {
    try {
      const fragment = new Fragment({
        ownerId: user,
        type: contentType,
      });
      await fragment.setData(data);
      await fragment.save();

      logger.info('Successfully created fragment');
      res.setHeader('Location', `${api}/v1/fragments/${fragment.id}`);
      res.status(201).json(createSuccessResponse({ fragment }));
    } catch (error) {
      next(error);
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'Unsupported Content Type'));
  }
};
