const router = require('express').Router();

router.post('/payment', (req, res) => {
    const KEY = process.env.STRIPE_KEY
    const Stripe = require('stripe');
    const stripe = new Stripe(KEY);

    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:'usd'
    }, (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).send(stripeErr);
        } else {
            res.status(200).send({success:stripeRes});
        }
    });
})

module.exports = router;