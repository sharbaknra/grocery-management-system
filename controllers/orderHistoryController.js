const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");

const orderHistoryController = {
  // GET /api/orders (Admin/Staff only) - Get all orders
  getAllOrders: async (req, res) => {
    // Additional authorization check (defense in depth)
    // The middleware should block customers, but this adds an extra check
    const userRole = req.user?.role;
    
    if (userRole !== "admin" && userRole !== "staff") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient privileges. Only Admin and Staff can view all orders.",
      });
    }
    
    try {
      // Get all orders with user information
      const orders = await Order.getAll();

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.getByOrderId(order.order_id);
          return {
            ...order,
            items: items.map((item) => ({
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
              product_category: item.product_category,
              quantity: item.quantity,
              unit_price_at_sale: parseFloat(item.unit_price_at_sale), // Critical: price at time of sale
              item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
            })),
            item_count: items.length,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithItems,
          total_orders: ordersWithItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching orders.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // GET /api/orders/me (Customer access only) - Get customer's own orders
  getMyOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get user's orders
      const orders = await Order.getByUserId(userId);

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderItem.getByOrderId(order.order_id);
          return {
            ...order,
            items: items.map((item) => ({
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_image: item.product_image,
              product_category: item.product_category,
              quantity: item.quantity,
              unit_price_at_sale: parseFloat(item.unit_price_at_sale), // Critical: price at time of sale
              item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
            })),
            item_count: items.length,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          orders: ordersWithItems,
          total_orders: ordersWithItems.length,
        },
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching your orders.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // GET /api/orders/:orderId - Get single order by ID
  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get order
      const order = await Order.getById(parseInt(orderId));

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      // Check authorization: Admin/Staff can see any order, Customers can only see their own
      if (userRole !== "admin" && userRole !== "staff" && order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. You can only view your own orders.",
        });
      }

      // Get order items
      const items = await OrderItem.getByOrderId(parseInt(orderId));

      const orderWithItems = {
        ...order,
        items: items.map((item) => ({
          order_item_id: item.order_item_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          product_category: item.product_category,
          quantity: item.quantity,
          unit_price_at_sale: parseFloat(item.unit_price_at_sale),
          item_total: parseFloat(item.unit_price_at_sale) * item.quantity,
        })),
        item_count: items.length,
      };

      res.status(200).json({
        success: true,
        data: {
          order: orderWithItems,
        },
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching order.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = orderHistoryController;

