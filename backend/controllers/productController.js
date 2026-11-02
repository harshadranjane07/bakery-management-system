const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @desc    Get all bakery products with optional filter and search
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const { search, category, featured, sort } = req.query;

    const query = {};

    // Keyword search across product name and description
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Filter by Category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('[ProductController] Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get featured bakery products for homepage
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .limit(6);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, imageUrl, unit, isFeatured } = req.body;

    if (!name || !category || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product details (name, category, price, description)'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Determine image URL (either uploaded file or passed URL)
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80';
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      stock: Number(stock) || 0,
      imageUrl: finalImageUrl,
      unit: unit || 'piece',
      isFeatured: isFeatured === 'true' || isFeatured === true
    });

    const populated = await Product.findById(product._id).populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populated
    });
  } catch (error) {
    console.error('[ProductController] Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, imageUrl, unit, isFeatured } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category selected'
        });
      }
      product.category = category;
    }

    if (name) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (description) product.description = description.trim();
    if (stock !== undefined) product.stock = Number(stock);
    if (unit) product.unit = unit;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;

    // Handle file upload or image URL update
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    console.error('[ProductController] Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Upload product image file
 * @route   POST /api/products/upload
 * @access  Private/Admin
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`
  });
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};
