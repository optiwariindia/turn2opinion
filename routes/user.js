const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = mongoose.model("user", require("../modals/user"));
const email = require("../service/email");
const twig = require("twig");
const user = require('../modals/user');

router.use(session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }));
router.post("/auth",(req,res)=>{
    User.find({ email: req.body.user, password: req.body.pass }).then(user => {
        if (user.length === 1) {
            req.session.user = user[0];
            res.json({ "status": "ok", "user": user[0],"redirect":"/user/survey/professional" });
        } else {
            res.json({"status": "error", "message": "User not found","info":user,"inputs":req.body });
        }
    })
})
router.use("/history", getUserInfo, userDetails, require("./history"));

router.post("/validate/:field", (req, res) => {
    switch (req.params.field) {
        case "email":
            if (!email.validate(req.body.email, (status, message) => {
                if (status == "error") {
                    res.json({ "status": "error", "message": message });
                    return false;
                }
                User.findOne({ email: req.body.emaill }).then(user => {
                    if (user) {
                        res.json({ "status": "error", "message": "Already registered" });
                        return false;
                    }
                    res.json({ "status": "success", "message": "Email is available" });
                    return true;
                })
            }))
                break;
        case "phone":
            phone = req.body.phone;
            User.findOne({ phone: phone }).then(user => {
                if (user) {
                    res.json({ "status": "error", "message": "Already registered" });
                    return false;
                }
                res.json({ "status": "success", "message": "Phone is available" });
                return true;
            });
            break;
        default:
            break;
    }
})
router.route("/forgot")
    .get((req, res) => {
        res.render("index.twig", { form: "forgot" });
    })
    .post((req, res) => {
        User.findOne({ email: req.body.email }).then(user => {
            if (user.security.answer == req.body.security) {
                twig.renderFile("mailers/template.twig", { fn: user.fn, message: "forgotPassword", reset_link: process.env.site + "/user/pwreset/" + user._id }, (e, h) => {
                    email.sendEmail(user.email, "Turn2Opinion: Reset Password", h, h);
                    res.json({ "status": "ok", "user": user });
                });
            } else {
                res.json({ "status": "error", "message": "Security answer is incorrect" });
            }
        });
        // res.json({"status":"error","message":"Not implemented yet"});
    })
router.post("/securityquestion", (req, res) => {
    User.findOne({ email: req.body.email, security: { answer: req.body.answer } }).then(user => { console.log(user); });
    res.json({ "status": "ok", "question": "In what city were you born?" });
})
router.post("/new", (req, res) => {
    new User({
        fn: req.body.fn,
        ln: req.body.ln,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        cn: req.body.cn,
        cntry: req.body.cntry,
        timezone: req.body.timezone
    }).save().then(usr => {
        twig.renderFile("mailers/template.twig", { message: "activation", site: process.env.site, fn: usr.fn, id: usr._id }, (e, h) => {
            email.sendEmail(usr.email, "Activate Your Turn2Opinion Account", "", h);
            res.json({ status: "ok", user: usr });
        })
    }).catch(err => {
        res.json({ status: "errror", message: err.message });
        return false;
    });
});
router.post("/login", (req, res) => {
    User.find({ email: req.body.user, password: req.body.pass }).then(user => {
        if (user.length === 1) {
            req.session.user = user[0];
            res.json({ "status": "ok", "user": user[0] });
        }
        else
            res.json({ "status": "error", "message": "Your E-mail or password is not matching with our record. Please try again." });
    }).catch(err => {
        res.json({ "status": "error", message: err.message });
    })
})
router.get("/verify/:id", (req, res) => {
    securityqs = JSON.parse(require("fs").readFileSync("./dummyData/security.json"));
    User.findById(req.params.id).then(user => { user.verified.email = true; user.save(); });
    res.render("index.twig", { form: "setpass", id: req.params.id, securityqs });
})
router.route("/resetpass/:id")
    .get((req, res) => {
        res.render("index.twig", { form: "resetpass", id: req.params.id });
    })
    .post((req, res) => {
        console.log(req.params.id);
        User.findById(req.params.id).then(u => {
            console.log(u);
            u.password = req.body.pass;
            u.save().then(usr => {
                req.session.user = usr;
                console.log(usr);
                res.json({ "status": "ok", "user": usr });
            })
        }).catch(err => {
            res.json({ "status": "error", message: err.message });
        })
    })
router.post("/setpass", (req, res) => {
    User.findById(req.body.id).then(user => {
        user.password = req.body.pass;
        user.security.question = req.body.secque;
        user.security.answer = req.body.ans;
        user.save().then(usr => {
            req.session.user = usr;
            console.log(usr);
            res.json({ "status": "ok", "user": usr });
            // res.redirect("/user/dashboard");
        })
    }).catch(err => {
        res.json({ "status": "error", message: err.message });
    })
})
router.route("/welcome")
    .get(getUserInfo, userDetails, (req, res) => {
        res.render("welcome.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
    })
    .post((req, res) => {
        User.findById(req.body.userId).exec().then(user => {
            terms = Object.keys(req.body).filter(key => key.indexOf("userid") === -1);
            User.findOneAndUpdate({ _id: req.body.userid }, { $set: { terms: terms } }).then(user => {
                User.findById(user._id).exec().then(user => {
                    req.session.user = user;
                    res.redirect("/user/welcome");
                });
            })
        })
    });
router.get("/dashboard",
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
        res.render("dashboard.twig", { page: { title: "Dashboard", icon: "" }, user: req.user, filters });
    })
router.use(fileUpload())
    .use(getUserInfo, userDetails)
    .use("/profile", require("./profile"))
    .use("/survey",require("./survey"));


function getUserInfo(req, res, next) {
    if (("user" in req.session)) {
        req.user = req.session.user;
        console.log("User found in session variable");
        next();
        return;
    }else{
        res.redirect("/");
    }
}
function userDetails(req, res, next) {
    req.user.propic = req.user.propic || "/assets/images/avatars/user.webp";
    num=Date.parse(req.user.dob);
    req.user.dob=new Date(num).toISOString().split("T")[0];
    req.user.statusSummary = JSON.parse(require("fs").readFileSync("./dummyData/statusSummary.json"));
    req.user.profileCategories = JSON.parse(require("fs").readFileSync("./dummyData/profileCategoires.json"));
    req.user.summary = JSON.parse(require("fs").readFileSync("./dummyData/summary.json"));
    req.user.availableSurveys = JSON.parse(require("fs").readFileSync("./dummyData/availableSurvey.json"));
    next();
}

module.exports = router;