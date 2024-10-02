const { verify } = require("jsonwebtoken");

const authorization = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new Error("Token not found");
    }
    token = token.split(" ")[1];

    verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: err?.message });
      }
      if (decoded) {
        req.decoded = decoded;
      }
      if (!err) {
        next();
      }
    });
    
  } catch (error) {
    return res.status(500).json({ message: error?.message ?? 'something went wrong' });
  }
};

module.exports = authorization;
