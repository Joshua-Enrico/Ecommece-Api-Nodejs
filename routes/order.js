const router = require('express').Router();
const { verifyTokenAndAuth, verifyToken, verifyTokenAndAdmin } = require('./verifyToken');
const Order = require('../models/Order');

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(savedOrder);
    } catch (err) {
        res.status(400).send(err);
    }
})

//Update Order
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {

        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true }
        );
        return res.status(200).json(updateOrder);

    } catch (err) {
        res.status(400).send(err);
    }
})

// Delete Order
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        return res.status(200).json("Order Deleted")
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get User Orders
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
    try {
        const orders = await Order.findOne({ userId: req.params.userId });

        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);

    } catch (err) {
        return res.status(500).send(err);
    }
})

// GET last 2 MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previoustMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    console.log(previoustMonth);
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previoustMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        return res.status(200).json(income);
    } catch (err) {
        return res.status(500).send(err);
    }
});


// GET YEAR MONTHLY INCOME

router.get("/year/income", verifyTokenAndAdmin, async (req, res) => {
    try {
        const yearIincome = await Order.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales"}
                }
            }

        ])
        return res.status(200).json(yearIincome);
    } catch (err) {
        return res.status(500).send(err);
    }
});


module.exports = router;