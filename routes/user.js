const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = mongoose.model("user", require("../modals/user"));


router.use("/dashboard", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30,secure:false } }));
router.use("/profile", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30,secure:false } }));
router.use("/welcome", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30,secure:false } }));
router.use("/history", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30,secure:false } }));
router.use("/history", getUserInfo, userDetails, require("./history"));

router.route("/welcome")
    .get(getUserInfo, userDetails, (req, res) => {
        res.render("welcome.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
    })
    .post( (req, res) => {
        User.findById(req.body.userId).exec().then(user=>{
            terms=Object.keys(req.body).filter(key=>key.indexOf("userid")===-1);
            User.findOneAndUpdate({ _id: req.body.userid }, { $set: { terms: terms } }).then(user=>{
                console.log(user);
                res.redirect("/user/welcome");
            })
        })
    });
router.route("/dashboard")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            let filters = [];
            req.user.availableSurveys.forEach(survey => {
                if (survey.sstat !== "" && (filters.indexOf(survey.sstat) === -1))
                    filters.push(survey.sstat);
                if (survey.sact !== "" && (filters.indexOf(survey.sact) === -1))
                    filters.push(survey.sact);
            })
            res.render("dashboard.twig", { user: req.user, filters });
        })
app.use(fileUpload());
router.route("/profile/")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            res.render("profile.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
        })
    .post(getUserInfo, (req, res) => {
        type = req.files.propic.mimetype.split("/");
        if (type[0] !== "image") {
            res.json({ "error": "Only Image Files are allowed" });
            return false;
        }
        req.files.propic.mv(`public/assets/images/avatars/${req.user._id}.${type[1]}`);
        User.findOne({ email: req.user.email }).then(user => {
            user.propic = `/assets/images/avatars/${req.user._id}.${type[1]}`;
            user.save();
            res.redirect("/user/profile");
        })
    })
router.route("/profile/:profilename")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            req.user.basicpro = JSON.parse(require("fs").readFileSync("./dummyData/profile.basic.json"));
            res.render("form.twig", { user: req.user, page: { title: "Basic Profile", icon: "basic-profile.png" } });
            // res.json(req.user);
        })
function getUserInfo(req, res, next) {
    // if (("user" in req.session)) {
    //     req.user = req.session.user;
    //     console.log("User found in session variable");
    //     next();
    //     return;
    // }

    console.log("Looking for user in database");
    User.findOne({ email: "om.tiwari@frequentresearch.com" })
        .then(user => {
            user['name'] = user.fn + " " + user.ln;
            if(user.terms.length === 0){
                if(req.url.indexOf("/dashboard")!==0){
                    res.redirect("/user/dashboard");
                    return;
                }
            }
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
    req.user.availableSurveys = JSON.parse(require("fs").readFileSync("./dummyData/availableSurvey.json"));
    next();
}
module.exports = router;