const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        img: { type: String, required: true },
        description: { type: String, required: true },
        bg: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SlideImages", ProductSchema);