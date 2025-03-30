const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.session.cycle == null) {
        req.session.cycle = 0;
    }
    
    res.render("study", {
        layout: "index",
        title: "Pomodoro",
        cycle: req.session.cycle
    });
    console.log("Study Cycle: " + req.session.cycle);
});

router.get("/debug", (req, res) => {
    res.send(req.session);
});
module.exports = router;