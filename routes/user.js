const express = require("express");
const User = require("../models/user");
const { Product } = require("../models/product");
const { auth } = require("../middlewares/auth");
const bcryptjs = require("bcryptjs");
const userRouter = express.Router();

userRouter.put("/api/update", auth, async (req, res) => {
  try {
    const { userId } = req;

    const { body } = req;
    let user = await User.findById({ _id: userId });
    if (body.name != null) {
      user.name = body.name;
    }
    if (body.address != null) {
      user.address = body.address;
    }
    if (body.newPassword != null) {
      const isCorrectPassword = await bcryptjs.compare(
        user.password,
        body.oldPassword
      );
      if (!isCorrectPassword) {
        return res.status(400).json({ msg: "The Password is not Correct!" });
      } else {
        const newHashedPassowrd = await bcryptjs.hash(body.newPassword, 8);
        user.password = newHashedPassowrd;
      }
    }
    user = await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

userRouter.post("/api/address", auth, async (req, res) => {
  try {
    const { userId } = req;
    const { address } = req.body;

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        address,
      }
    );

    return res.status(200).json(user);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

userRouter.delete(
  "/api/remove-from-cart/:productId",
  auth,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const { userId } = req;
      let user = await User.findById({ _id: userId });

      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id == productId) {
          user.cart.splice(i, 1);
          break;
        }
      }
      user = await user.save();

      return res.status(200).json(user);
    } catch (error) {
      console.log("error.message: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
);
userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body;

    console.log("userId: ", userId);
    console.log("productId: ", productId);
    console.log("quantity: ", quantity);

    let user = await User.findById({ _id: userId });

    console.log("user: ", user);

    const product = await Product.findById({ _id: productId });

    if (!product) {
      return res.status(400).json({ msg: "The Product is Not Found." });
    }

    if (user.cart.length == 0) {
      user.cart.push({
        product,
        quantity: quantity,
      });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          user.cart[i].quantity += quantity;
          isProductFound = true;
          break;
        }
      }

      if (!isProductFound) {
        user.cart.push({
          product,
          quantity: quantity,
        });
      }
    }

    user = await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
