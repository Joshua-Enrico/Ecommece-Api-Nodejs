const mongoose = require("mongoose")


const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true},
        Product: { 
            productId: { type: String, required: true},
            quantity: { type: Number, default: 1},
        },
        cart: { type: Array , default: []},

        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", CartSchema);