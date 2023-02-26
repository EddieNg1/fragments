const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    res.status(200).send(data);
  } catch (error) {
    throw new Error('Error getting fragment data by ID');
  }
};
