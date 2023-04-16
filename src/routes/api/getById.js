//const path = require('path');
const mime = require('mime-types');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    var id = req.params.id;
    var extension = mime.lookup(id);
    if (req.params.id.includes('.')) {
      id = req.params.id.split('.').slice(0, -1).join('.');
    }
    //const fragment = await Fragment.byId(req.user, id);
    const fragment = await Fragment.byId(req.user, id);
    const fragmentData = await fragment.getData();
    var type;
    if (fragment.formats.includes(extension)) {
      type = extension;
    } else if (extension == false) {
      type = fragment.mimeType;
    }
    var data = fragment.convertType(fragmentData, type);
    res.setHeader('Content-type', type);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).json(createErrorResponse(404, "Fragment doesn't exist"));
  }
};

module.exports.info = async (req, res, next) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    if (!fragment) {
      const error = new Error('Fragment not found');
      error.status = 404;
      throw error;
    }
    console.log(fragment);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    next(err);
  }
};
