require("dotenv").config();
const express = require("express");
const { append } = require("express/lib/response");
const mongoose = require("mongoose");
const publicDir=__dirname.split("/").slice(0,-1).join("/")+"/public";
// const publicDir = __dirname + "/public";
console.log(publicDir);

app = express();
mongoose.connect(process.env.mongodb, { useNewUrlParser: true })
    .then(() => {
        app.set('view engine', "twig");
        if (process.env.mode == "dev") {
            const livereload = require("livereload");
            const connectLivereload = require("connect-livereload");
            const server = livereload.createServer();
            server.watch(publicDir);
            // server.watch(__dirname);
            server.server.once("connection", () => {
                setTimeout(() => {
                    server.refresh();
                }, 1000);
            })
            app.use(connectLivereload());
        }

        app.use(express.static(publicDir))
            .use(express.urlencoded({ extended: true }))
            .use(express.json())

            .use(require("./routes/index"))
            .use("/user", require("./routes/user"))
            .use("/api/v1/",require("./routes/api"))

            .listen(process.env.port, () => {
                console.log("Server started on port " + process.env.port);
            });
    })
