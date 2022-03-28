const router = require('express').Router();
const mongoose = require("mongoose")
const FAQ = mongoose.model("faq", require("../modals/faq"));

router.route("/")
    .get((req, res) => {
        FAQ
            .find({}).then(faqs => {
                res.render("page.twig",{faqs,page:{title:"Frequently Asked Questions",name:"faq"}});
            })
            .catch(err => {
                res.json(err);
            })
    })
module.exports = router;