const Product = require("../models/product");

// Add Product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category, subCategory, colors, stock } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        let parsedColors = [];
        if (colors) {
            try {
                parsedColors = JSON.parse(colors);
            } catch (e) {
                parsedColors = Array.isArray(colors) ? colors : [colors];
            }
        }

        const product = new Product({
            name,
            description,
            price: Number(price),
            offerPrice: Number(offerPrice),
            category,
            subCategory,
            images,
            colors: parsedColors,
            stock: stock ? Number(stock) : 0,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            product,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    addProduct,
    getProducts,
};

const getproducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Single Product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category, subCategory, colors, stock } = req.body;
        
        let updateData = {
            name,
            description,
            price: Number(price),
            offerPrice: Number(offerPrice),
            category,
            subCategory,
            stock: stock ? Number(stock) : 0,
        };

        if (colors) {
            try {
                updateData.colors = JSON.parse(colors);
            } catch (e) {
                updateData.colors = Array.isArray(colors) ? colors : [colors];
            }
        }

        // If new images are uploaded, update them
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { addProduct, getProducts, getproducts, getProductById, updateProduct, deleteProduct };
