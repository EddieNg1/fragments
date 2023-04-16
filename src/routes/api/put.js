const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    if (fragment.type == req.get('Content-Type')) {
      await fragment.setData(req.body);
      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      res.status(400).json(createErrorResponse(400, 'Cannot change fragment type'));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
