const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const User = mongoose.model("user", require("../modals/user"));


router.use("/dashboard", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30 } }));
router.use("/profile", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30 } }));

router.route("/dashboard")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            let filters=[];
            req.user.availableSurveys.forEach(survey=>{
                if(survey.sstat!=="" && (filters.indexOf(survey.sstat)===-1))
                filters.push(survey.sstat);
                if(survey.sact!=="" && (filters.indexOf(survey.sact)===-1))
                filters.push(survey.sact);
            })
        res.render("dashboard.twig", { user: req.user ,filters});
    })
router.route("/profile/:profilename")
.get(
    getUserInfo,
    userDetails,
    (req,res)=>{
        req.user.basicpro = JSON.parse(require("fs").readFileSync("./dummyData/profile.basic.json")); 
        res.render("form.twig",{user:req.user});
    // res.json(req.user);
})
function getUserInfo(req, res, next) {
    if (("user" in req.session)) {
        req.user = req.session.user;
        console.log("User found in session variable");
        next();
        return;
    }

    console.log("Looking for user in database");
    User.findOne({ email: "om.tiwari@frequentresearch.com" })
        .then(user => {
            console.log("User found in database");
            user['name'] = user.fn + " " + user.ln;
            if (user.propic === undefined) user.propic = "/assets/images/avatars/user.webp";
            // Dummy Data about User
            req.user = user;
            req.session.user = user;
            next();
        })
        .catch(err => {
            console.log("User not found in database");
            console.log(err);
            res.sendStatus(404).render("/404.twig", { error: "User Unavilable at the moment" });
        })

}
function userDetails(req, res, next) {
    req.user.statusSummary = JSON.parse(require("fs").readFileSync("./dummyData/statusSummary.json"));
    req.user.profileCategories = JSON.parse(require("fs").readFileSync("./dummyData/profileCategoires.json"));
    req.user.summary = JSON.parse(require("fs").readFileSync("./dummyData/summary.json"));
    req.user.availableSurveys=JSON.parse(require("fs").readFileSync("./dummyData/availableSurvey.json"));    
    next();
}
module.exports = router;