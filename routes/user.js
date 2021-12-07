const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const { verifyTokenAndAuth, verifyToken, verifyTokenAndAdmin } = require('./verifyToken');


router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSPHRASE).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        const { password, ...others } = updatedUser._doc;
        return res.status(200).json(others);
    } catch (err) {
        return res.status(500).send(err);
    }
});


//Deactivate user
router.put("/deactivate/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deactivatedUser = await User.findByIdAndUpdate(req.params.id, {
            isActive: false,
        }, {new: true});
        return res.status(200).json("User deactivated");
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Activate user
router.put("/activate/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const activateUser = await User.findByIdAndUpdate(req.params.id, {
            isActive: true,
        }, {new: true});
        return res.status(200).json("User activated");
    } catch (err) {
        return res.status(500).send(err);
    }
})
// Delete user

router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json("User Deleted")
    } catch (err) {
        return res.status(500).send(err);
    }
})

// Find User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        return res.status(200).json(others)
    } catch (err) {
        return res.status(500).send(err);
    }
})



module.exports = router;