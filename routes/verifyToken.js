const jwt = require("jsonwebtoken");

//Check if user has token for private routes
module.exports = function (req, res, next) {
  // Check if token exists in header
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
