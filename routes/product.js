const router = require('express').Router();
const { verifyTokenAndAuth, verifyToken, verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/Product');
const { FieldsValidation } = require('./functions/fieldsvalidation');

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch (err) {
        res.status(400).send(err);
    }
})

//Update Product

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const validate = FieldsValidation(req.body);
        if (validate.flag === true) {
            return res.status(400).send(validate.message);
        } else {
            const updateProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                }, { new: true }
            );
            return res.status(200).json(updateProduct);
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

// Delete Product

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json("Product Deleted")
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get Product
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).send(err);
    }
})

//Deactivate product
router.put("/deactivate/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deactivatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            active: false,
        }, { new: true });
        return res.status(200).json("Product deactivated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
        } else {
            products = await Product.find();
        }

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).send(err);
    }
})

module.exports = router;