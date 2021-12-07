const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//Api Auth
router.post("/register", async (req, res) => {

    if (req.body.email === undefined || req.body.password === undefined || req.body.username === undefined) {
        return res.status(400).send("Missing fields");
    } else {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSPHRASE).toString()
        });


        try {
            const SavedUser = await newUser.save()
            return res.status(201).send("User created successfully");
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }
}),

    //Login
    router.post("/login", async (req, res) => {

        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(401).json({ message: "Wrong credential" });
            }
            if (user.isActive === false) {
                return res.status(401).json({ message: "User is not active" });
            }
            const hashedp = CryptoJS.AES.decrypt(user.password, process.env.PASSPHRASE).toString(CryptoJS.enc.Utf8);

            if (hashedp !== req.body.password) {
                return res.status(401).json({ message: "Wrong credential" });
            }
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                }, process.env.JWT_SEC,
                {expiresIn: "3d"}
            )
            const { password, ...others } = user._doc;
            return res.status(200).json({...others, accessToken});
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    })

module.exports = router;