const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  const api = process.env.API_URL || req.headers.host;
  try {
    let id = req.params.id;
    const fragmentContent = req.body;
    const fragment = await Fragment.byId(req.user, id);
    await fragment.setData(fragmentContent);
    await fragment.save();
    res
      .status(200)
      .location(`${api}/v1/fragments/${fragment.id}`)
      .json(createSuccessResponse(fragment));
  } catch (err) {
    console.log(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
