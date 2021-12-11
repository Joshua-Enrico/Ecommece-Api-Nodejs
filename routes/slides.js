const router = require('express').Router();
const { verifyTokenAndAuth, verifyToken, verifyTokenAndAdmin } = require('./verifyToken');
const SlideImages = require('../models/SlideImages');

// CREATE SLIDE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const maxSlidesItems = await SlideImages.find().countDocuments();
    
    if (maxSlidesItems >= 5) {
        return res.status(400).send("Max slides items reached");
    }
    const newSlide = new SlideImages(req.body);

    try {
        const savedSlide = await newSlide.save();
        return res.status(200).json(savedSlide);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all SLIDES
router.get("/", async (req, res) => {
    try {
        const slides = await SlideImages.find();
        res.status(200).json(slides);

    } catch (err) {
        return res.status(500).send(err);
    }
});

//Update SLIDE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {

        const updateSlide = await SlideImages.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true }
        );
        return res.status(200).json(updateSlide);

    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE SLIDE
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const MinSlidesItems = await SlideImages.find().countDocuments();

        if (MinSlidesItems <= 3) {
            return res.status(400).send("Min slides items reached");
        }

        const deletedSlide = await SlideImages.findByIdAndDelete(req.params.id)
        
        if (!deletedSlide) {
            return res.status(400).send("Slide not found");
        }

        return res.status(200).json("Slide Deleted")
    } catch (err) {
        return res.status(500).send(err);
    }
})



module.exports = router;