const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "product name must be provided"],
      cast: false,
    },
    price: {
      type: Number,
      require: [true, "product price must be provided"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 1,
    },
    company: {
      type: String,
      enum: {
        values: ["ikea", "liddy", "caressa", "marcos"],
        message: "{VALUE} is not supported",
      },
      default: "ikea",
    },
    gender: {
      type: String,
      enum: {
        values: ["Nam", "Nữ"],
        message: "{VALUE} is not supported",
      },
      default: "Nam",
    },
    detail: {
      type: String,
      default: "None",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
