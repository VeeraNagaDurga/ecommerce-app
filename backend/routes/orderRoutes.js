const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.post('/', createOrder);
router.get('/mine', getUserOrders);
router.get('/', adminMiddleware, getAllOrders);

module.exports = router;
