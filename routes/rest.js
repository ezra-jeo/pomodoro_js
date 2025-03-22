const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    const cycle = req.query.cycle || 0;

    res.render("rest", {
        layout: "index",
        cycle: cycle
    });

    console.log("Cycle: " + cycle);
});

module.exports = router;