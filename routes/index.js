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
router.get("/mailer/:type",(req,res)=>{
    twig.renderFile("mailers/template.twig", { message: req.params.type, site: process.env.site, fn: "Om",link:"dsakfjdsaf/dsajflkdsa",reset_link:"dsakfjdsaf/dsajflkdsa", id: "dsaf2r54325" }, (e, h) => {
        // email.sendEmail(usr.email, "Activate Your Turn2Opinion Account", "", h);
        res.send(h);
    })
})
module.exports = router;