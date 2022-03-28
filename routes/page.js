const twig = require('twig');
let captchakey="6LemN6UeAAAAAMqv3WRb0kGJ4kKZWN374FVW2z7-";
const router = require('express').Router();
router.route("/")
    .get((req, res) => {
        project=JSON.parse(require("fs").readFileSync("./databank/project.json"));
        res.render("index",{captchakey:captchakey,project:project});
    })
    .post((req, res) => {
        res.send("post");
    })
    .put((req, res) => {
        res.send("put");
    })
    .patch((req, res) => {
        res.send("patch");
    })
    .delete((req, res) => {
        res.send("delete");
    });
router.route("/:page").get((req,res)=>{
    project=JSON.parse(require("fs").readFileSync("./databank/project.json"));
    page={
        "name":req.params.page
    }
    res.render("page",{project,page});
})
    module.exports = router;