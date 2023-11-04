const express = require("express");
const Product = require("../models/product");
const { auth } = require("../middlewares/auth");
const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res, next) => {
  try {
    const { query } = req.query;

    console.log("query: ", query);

    const products = await Product.find({
      name: { $regex: query, $optiCons: "i" },
    });
    console.log("products: ", products);

    return res.status(200).json(products);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

productRouter.get("/api/products-by-category", auth, async (req, res) => {
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

module.exports = productRouter;
