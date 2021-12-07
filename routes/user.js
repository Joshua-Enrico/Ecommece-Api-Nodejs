const router = require('express').Router();


router.get("/usertest", (req, res) => {
    res.send("User Test successful");
});

router.post("/userpost", (req, res) => {
    const username = req.body.username;
    console.log(username);
    res.send("User " + username + " Post successful" );
})

module.exports = router;