const express = require("express");
const Product = require("../models/product");
const userRouter = express.Router();

userRouter.get("/api/products-by-category", async (req, res) => {
  try {
    const { category } = req.query;

    console.log("category: ", category);
    const products = await Product.find({
      category,
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
