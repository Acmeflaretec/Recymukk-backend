
const errorResponse = (req, res, next) => {
  try {
   return res.status(401).json({})
  } catch (error) {
    throw new Error(error)
  }
};

module.exports = errorResponse;
