const express = require("express");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const envObject = require("../env");
const { auth } = require("../middlewares/auth");
const authRoute = express.Router();

authRoute.post("/api/user", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("req.body: ", req.body);
    const existingUesr = await User.findOne({ email });
    if (existingUesr) {
      return res.status(400).json({
        msg: "User with same email already exist.",
      });
    }

    // if (password.length <= 6) {
    //   return res.status(400).json({
    //     msg: "A password must be longer than 5 Char.",
    //   });
    // }

    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = await new User({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: error.message });
  }
});

authRoute.post("/api/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: `${email} is Not exist.` });
    }

    const isCorrectPassword = await bcryptjs.compare(password, user.password);

    if (!isCorrectPassword) {
      return res
        .status(400)
        .json({ msg: `The Password is Wrong. Please Try Again.` });
    }
    const token = jsonWebToken.sign({ id: user._id }, envObject.JWT_SECRET_KEY);
    return res.status(200).json({ token, ...user._doc });
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

authRoute.post("/tokenIsValid", async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.json(false);
    const verified = jsonWebToken.verify(token, envObject.JWT_SECRET_KEY);

    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);

    if (!user) return res.json(false);
    return res.json(true);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

authRoute.get("/", auth, async (req, res, next) => {
  const { userId } = req;
  const user = await User.findById(userId);

  return res.json({ ...user._doc, token: req.token });
});
module.exports = authRoute;
