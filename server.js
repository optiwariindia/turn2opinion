require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { append } = require("express/lib/response");
const mongoose = require("mongoose");
const fs = require("fs");
const compression = require("compression");
const Twig= require("twig");
let publicDir;
if (fs.existsSync("./public"))
    publicDir = __dirname + "/public";
else
    publicDir = __dirname.split("/").slice(0, -1).join("/") + "/public";

// console.log(publicDir);
Twig.extendFilter("textformat",(value,params)=>{
    switch(params[0]){
        case "percent":
            return value.toFixed(0) + "%";
        case "money":
            return "$" + value.toFixed(2)+ " USD";
    }
})

app = express();
mongoose.connect(process.env.mongodb, { useNewUrlParser: true })
    .then(() => {
        app.use(compression())
        app.set('view engine', "twig");
        if (process.env.mode == "dev") {
            const livereload = require("livereload");
            const connectLivereload = require("connect-livereload");
            const server = livereload.createServer();
            server.watch(publicDir);
            server.server.once("connection", () => {
                setTimeout(() => {
                    server.refresh();
                }, 1000);
            })
            app.use(connectLivereload());
        }
        app
            // .use(compression({ threshold: 0 }))
            .use(express.static(publicDir))
            .use(express.urlencoded({ extended: true }))
            .use(express.json())
            .use(session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }))
            .use(logs)
            .use((req, res, next) => {
                if (req.session.passport) {
                    info = { provider: req.session.passport.user.provider, id: req.session.passport.user.id };
                }
                next();
            })
            .use(require("./routes/index"))
            .use("/social", require("./routes/social.js"))
            .use("/faq", require("./routes/faq"))
            .use("/user", require("./routes/user"))
            .use("/page", require("./routes/page"))
            .use("/api/v1/", require("./routes/api"))
            .use((req, res) => {
                project = JSON.parse(require("fs").readFileSync("./databank/project.json"));
                res.status(404).render("404.twig", { project });
            })
            .listen(process.env.port, () => {
                console.log("Server started on port " + process.env.port);
            });
    })
const logs = (req, res, next) => {
    // console.log([req.method,req.url||{},req.session||{},req,body||{}]);
    next();
}