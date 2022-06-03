const express = require("express");
const router = express.Router();
const authUser = require("../middleware/auth");

const {
  getAllProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

router.route("/").get(getAllProduct).post(authUser, createProduct);
router
  .route("/:id")
  .get(authUser, getProduct)
  .delete(authUser, deleteProduct)
  .patch(authUser, updateProduct);

module.exports = router;
