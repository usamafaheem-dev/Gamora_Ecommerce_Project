// controllers/adminWalletController.js
const AdminWallet = require('../models/AdminWallet');
const Order = require('../models/Order');

// Get admin wallet data
exports.getAdminWallet = async (req, res) => {
  try {
    let wallet = await AdminWallet.findOne({});

    if (!wallet) {
      wallet = new AdminWallet();
      await wallet.save();
    }

    // Get last 100 transactions
    const recentTransactions = wallet.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 100);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: wallet.totalRevenue || 0,
        completedAmount: wallet.completedAmount || 0,
        pendingAmount: wallet.pendingAmount || 0,
        transactions: recentTransactions
      }
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ success: false, message: 'Error fetching wallet data', error: error.message });
  }
};

// Update wallet when order status changes or new order created
exports.updateWallet = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    let wallet = await AdminWallet.findOne({});
    if (!wallet) {
      wallet = new AdminWallet();
    }

    // Check if transaction exists
    const transactionIndex = wallet.transactions.findIndex(
      t => t.orderId.toString() === orderId.toString()
    );

    const statusMapping = {
      delivered: 'completed',
      cancelled: 'cancelled',
      pending: 'pending'
    };

    if (transactionIndex !== -1) {
      // Update existing transaction status
      wallet.transactions[transactionIndex].status = statusMapping[newStatus] || 'pending';
    } else {
      // Add new transaction
      wallet.transactions.push({
        userId: order.userId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: statusMapping[newStatus] || 'pending'
      });
    }

    // Recalculate totals
    wallet.completedAmount = 0;
    wallet.pendingAmount = 0;

    wallet.transactions.forEach(t => {
      if (t.status === 'completed') wallet.completedAmount += t.amount;
      if (t.status === 'pending') wallet.pendingAmount += t.amount;
    });

    wallet.totalRevenue = wallet.completedAmount + wallet.pendingAmount;
    wallet.lastUpdated = new Date();

    await wallet.save();
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
};

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const wallet = await AdminWallet.findOne({}) || { totalRevenue: 0, completedAmount: 0, pendingAmount: 0 };
    
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const successRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: wallet.totalRevenue,
        completedAmount: wallet.completedAmount,
        pendingAmount: wallet.pendingAmount,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        successRate
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard stats', error: error.message });
  }
};
