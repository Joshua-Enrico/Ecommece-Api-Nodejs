const express = require('express');
const app = express();
var cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const slideRoute = require('./routes/slides');


dotenv.config();

mongoose.connect(process.env.MONGO_URL).
    then(() => console.log('Connected to MongoDB')).catch(err => console.log('Error: ', err));

    app.get("/api/test", () => {
        console.log("Api Test Successful");
    })

// Api Routes
app.use(cors())
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/slides", slideRoute);
app.use(express.static('public'));

// Auth Routes ends here

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port ' + process.env.PORT);
});