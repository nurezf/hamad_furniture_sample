import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// ============================
// Place COD Order
// ============================

const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    console.log(req.body);

    const orderData = {
      userId,
      items,
      address,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================

// ============================
// Get All Orders (Admin)
// ============================
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Get User Orders
// ============================
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Update Order Status
// ============================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log(req.body);

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    // If status changes to Delivered and it wasn’t already delivered
    if (status === "Delivered" && order.status !== "Delivered") {
      for (const item of order.items) {
        const product = await productModel.findOne({ name: item.name });
        if (product) {
          product.quantity = Math.max(product.quantity - item.quantity, 0);
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };
