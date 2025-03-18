const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    if (req.session.cycle == null) {
        req.session.cycle = 0;
    }
    else {
        req.session.cycle++;
    }

    res.render("rest", {
        layout: "index",
        cycle: req.session.cycle
    });
    console.log("Rest Cycle: " + req.session.cycle);
});

module.exports = router;