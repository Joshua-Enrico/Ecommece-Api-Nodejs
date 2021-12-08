const router = require('express').Router();
const {  verifyToken } = require('./verifyToken');
const Cart = require('../models/Cart');

// CREATE CART
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;