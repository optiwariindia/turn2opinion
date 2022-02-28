const twig = require('twig');
let captchakey="6LemN6UeAAAAAMqv3WRb0kGJ4kKZWN374FVW2z7-";
const router = require('express').Router();
router.route("/")
    .get((req, res) => {
        
        res.render("index",{captchakey:captchakey});
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
    module.exports = router;