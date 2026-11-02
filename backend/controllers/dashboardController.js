const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * @desc    Get Admin Dashboard Statistics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const lowStockProductsCount = await Product.countDocuments({ stock: { $lte: 5 } });

    // Low stock product list
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .populate('category', 'name')
      .limit(10);

    // Total revenue from all non-cancelled orders
    const completedOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Order status counts
    const pendingOrdersCount = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrdersCount = await Order.countDocuments({ orderStatus: 'Processing' });
    const deliveredOrdersCount = await Order.countDocuments({ orderStatus: 'Delivered' });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        lowStockProductsCount,
        totalRevenue,
        pendingOrdersCount,
        processingOrdersCount,
        deliveredOrdersCount
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error) {
    console.error('[DashboardController] Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};
