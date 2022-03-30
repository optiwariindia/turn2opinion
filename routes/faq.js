const router = require('express').Router();
const mongoose = require("mongoose")
const FAQ = mongoose.model("faq", require("../modals/faq"));

router.route("/")
    .get((req, res) => {
        FAQ
            .find({}).then(faqs => {
                project = JSON.parse(require("fs").readFileSync("./databank/project.json"));
                res.render("page.twig",{faqs,page:{title:"Frequently Asked Questions",name:"faq"},project});
            })
            .catch(err => {
                res.json(err);
            })
    })
module.exports = router;