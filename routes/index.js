const twig = require('twig');

const router = require('express').Router();
router.route("/")
    .get((req, res) => {
        
        res.render("index");
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