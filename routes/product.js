const express = require("express");
const Product = require("../models/product");
const { auth } = require("../middlewares/auth");
const productRouter = express.Router();

productRouter.post("/api/rate-product", auth, async (req, res, next) => {
  try {
    const { id, rating } = req.body;

    let product = await Product.findById(id);

    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.userId) {
        product.ratings.splice(i, 1);
        break;
      }
    }
    const ratingSchema = {
      userId: req.userId,
      rating,
    };

    product.ratings.push(ratingSchema);
    product = await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

productRouter.get("/api/products", auth, async (req, res, next) => {
  try {
    const { query } = req.query;

    console.log("query: ", query);

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
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
