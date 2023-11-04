const express = require("express");
const Product = require("../models/product");
const { admin } = require("../middlewares/admin");

const productRouter = express.Router();
productRouter.get("/admin/categories", (req, res, next) => {
  const productCategories = [
    "Mobiles",
    "Essentials",
    "Applications",
    "Books",
    "Fashion",
  ];

  return res.json({
    categories: productCategories,
  });
});

productRouter.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find();

    console.log("products: ", products);

    return res.status(200).json(products);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

productRouter.delete("/admin/delete-product", admin, async (req, res, next) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);

    if (product == null) {
      return res.status(400).json({ msg: "The Product is NOT found" });
    }

    const isDelete = await product.delete();
    console.log("isDelete: ", isDelete);

    console.log("product: ", product);

    return res.json(product);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

productRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, price, quantity, category, images } = req.body;
    console.log("req.body: ", req.body);
    if (name == images || images.length == 0) {
      return res.status(400).json({ msg: `Please Input images` });
    }
    if (name == null || name.length == 0) {
      return res.status(400).json({ msg: `Please Input name` });
    }
    if (price == null || price.length == 0) {
      return res.status(400).json({ msg: `Please Input price` });
    }
    if (quantity == null || quantity.length == 0) {
      return res.status(400).json({ msg: `Please Input quantity` });
    }
    if (category == null || category.length == 0) {
      return res.status(400).json({ msg: `Please Input category` });
    }

    let product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      images,
    });

    product = await product.save();

    console.log("newProduct: ", product);

    return res.json(product);
  } catch (error) {
    console.log("error.message: ", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = productRouter;
