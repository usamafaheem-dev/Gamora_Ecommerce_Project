const Product = require('../models/product');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Generate random token
const generateRandomToken = () => crypto.randomBytes(4).toString('hex');

// ✅ Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { sizes, ...otherFields } = req.body;

    // Parse sizes
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

    // ✅ Cloudinary image URLs instead of local paths
    const images = req.files ? req.files.map(file => file.path) : [];

    const productData = {
      ...otherFields,
      sizes: parsedSizes,
      images,
      token: generateRandomToken(),
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// ✅ Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'firstName lastName profileImage' }
    });

    const productsWithReviewStats = products.map(product => {
      const reviews = product.reviews || [];
      const reviewCount = reviews.length;
      const reviewAvg = reviewCount > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount)
        : 0;

      const prodObj = product.toObject();
      prodObj.reviewCount = reviewCount;
      prodObj.reviewAvg = reviewAvg;
      return prodObj;
    });

    res.status(200).json(productsWithReviewStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// ✅ Get a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// ✅ Update product
exports.updateProduct = async (req, res) => {
  try {
    const { sizes, existingImages, stock, ...otherFields } = req.body;

    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const parsedExistingImages =
      typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages || [];

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ New Cloudinary image URLs
    const newImages = req.files ? req.files.map(file => file.path) : [];

    // Combine old and new
    const images = [...parsedExistingImages, ...newImages];

    const productData = {
      ...otherFields,
      sizes: parsedSizes,
      images,
      token: existingProduct.token,
      stock:
        typeof stock !== 'undefined'
          ? Number(stock)
          : existingProduct.stock || 0,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// ✅ Delete product (optional: delete from Cloudinary)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ⚠️ Optional: If you want, you can add code to delete from Cloudinary later

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
