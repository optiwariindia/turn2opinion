const { randomInt } = require('crypto');
const twig = require('twig');
let captchakey = process.env.google_captcha_key;
const router = require('express').Router();
const homepage=require('../service/homepage.js');
router.route("/")
    .get(homepage)
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