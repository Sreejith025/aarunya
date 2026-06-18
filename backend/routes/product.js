const express = require("express");
const router = express.Router();

const {
    addProduct,
    getProducts
} = require("../controllers/productController");

router.post("/add", addProduct);
router.get("/all", getProducts);

module.exports = router;