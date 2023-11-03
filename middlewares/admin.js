const jsonWebToken = require("jsonwebtoken");
const envObject = require("../env");
const User = require("../models/user");

const admin = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied." });

    const verified = jsonWebToken.verify(token, envObject.JWT_SECRET_KEY);

    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification Failed, Authorization denied." });

    const user = await User.findById(verified.id);

    if (user.type == "user" || user.type == "seller") {
      return res.status(401).json({ msg: "You are not ad admin!!" });
    }
    req.userId = verified.id;
    req.token = token;
    next();
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { admin };
