const express = require('express');
const router = express.Router();
const { 
    addProduct, 
    getProducts, 
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const upload = require('../middleware/upload');

router.post('/', upload.array('images', 6), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', upload.array('images', 6), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;


