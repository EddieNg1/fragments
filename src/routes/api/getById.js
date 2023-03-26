const path = require('path');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    const extension = path.extname(req.params.id);
    const id = path.basename(req.params.id, extension);
    const fragment = await Fragment.byId(req.user, id);
    const data = await fragment.getData();
    if (extension) {
      const { convertedData, mimeType } = await fragment.convertedType(data, extension);
      res.set('Content-Type', mimeType);
      res.status(200).send(convertedData);
    } else {
      res.set('Content-Type', fragment.type);
      res.status(200).send(data);
    }
  } catch (error) {
    throw new Error('Error getting fragment data by ID');
  }
};

module.exports.info = async (req, res, next) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    console.log(fragment);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    next(err);
  }
};
