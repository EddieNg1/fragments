const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const fragment = await Fragment.byId(req.user, id);
    if (!fragment) {
      const error = new Error('Fragment not found');
      error.status = 404;
      throw error;
    }
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (error) {
    res.status(501).json(createErrorResponse(501, error.message));
  }
};
