const router = require('express').Router();
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken');
const Cart = require('../models/Cart');

// CREATE CART
router.post("/", verifyToken, async (req, res) => {
    console.log(req.body);
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
})

//Update Product
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {

        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true }
        );
        return res.status(200).json(updateCart);

    } catch (err) {
        res.status(400).send(err);
    }
})

// Delete Cart
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        return res.status(200).json("Cart Deleted")
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get User Cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne( {userId: req.params.userId});

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get all products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);

    } catch(err) {
        return res.status(500).send(err);
    }
})

module.exports = router;