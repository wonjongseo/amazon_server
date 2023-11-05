const mongoose = require("mongoose");
const ratingSchema = require("./rating");

const productSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    default: "",
    type: String,
    trim: true,
  },
  price: {
    required: true,
    type: Number,
  },
  quantity: {
    required: true,
    type: Number,
  },

  category: {
    required: true,
    type: String,
  },
  ratings: [ratingSchema],
});
ratingSchema;
const Product = mongoose.model("Product", productSchema);

module.exports = { Product, productSchema };
