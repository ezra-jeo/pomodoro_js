const express = require("express");
const server = express();
const session = require("express-session");

server.use(session({
    secret: "pomodoro123",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false 
    }
}));

const bodyParser = require("body-parser");
server.use(express.json());
server.use(express.urlencoded({ extended: true}));

const handlebars = require("express-handlebars");
server.set("view engine", "hbs");
server.engine("hbs", handlebars.engine({
    extname: "hbs"
}));

server.use(express.static("public"));

const studyRoute = require("./routes/study.js");

const restRoute = require("./routes/rest.js");

server.use("/", studyRoute);
server.use("/rest.hbs", restRoute);

// Clear cycles in session
server.get("/clear-cycle", (req, res) => {
    req.session.cycle = null;
    res.send({ cleared: true });
});

module.exports = server;
