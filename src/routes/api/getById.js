const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    res.status(200).send(data);
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
