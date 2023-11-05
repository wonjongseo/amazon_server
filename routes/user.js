const express = require("express");
const User = require("../models/user");
const { Product } = require("../models/product");

const userRouter = express.Router();

userRouter.post("/api/add-cart", async (req, res) => {
  try {
    const { userId } = req;
    const { productId, quantity } = req.body;

    console.log("userId: ", userId);
    console.log("productId: ", productId);
    console.log("quantity: ", quantity);

    let user = User.findById({ _id: userId });

    console.log("user: ", user);

    const product = Product.findById({ _id: productId });

    if (!product) {
      return res.status(400).json({ msg: "The Product is Not Found." });
    }

    const cartMap = {
      product,
      quantity,
    };

    user.cart.push(cartMap);

    user = await user.save();

    console.log("user: ", user);

    return res.status(200).json(user);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
