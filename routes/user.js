const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = mongoose.model("user", require("../modals/user"));
const email = require("../service/email");
const twig = require("twig");
const user = require('../modals/user');
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const Survey = mongoose.model("survey", require("../modals/survey"));

router.post("/auth", (req, res) => {
    User.find({ email: req.body.user, password: req.body.pass }).then(user => {
        if (user.length === 1) {
            req.session.user = user[0];
            res.json({ "status": "ok", "user": user[0], "redirect": "/user/dashboard" });
        } else {
            res.json({ "status": "error", "message": "User not found", "info": user, "inputs": req.body });
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
    User.findOne({ email: req.body.email, security: { answer: req.body.answer } }).then(user => {
        // console.log(user);
    });
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
            console.log(user[0]);
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

        // console.log(req.user.survey);//availableSurveys);
        let filters = [];
        user.survey = req.user.availableSurveys;
        res.render("dashboard.twig", { page: { title: "Dashboard", icon: "" }, user: req.user, filters });
    })
router.use(fileUpload())
    .use(getUserInfo, userDetails)
    .use("/profile", require("./profile"))
    .use("/survey", require("./survey"));


function getUserInfo(req, res, next) {
    if (("user" in req.session)) {
        req.user = req.session.user;
        console.log("User found in session variable");
        next();
        return;
    } else {
        res.redirect("/");
    }
}
async function userDetails(req, res, next) {
    req.user.propic = req.user.propic || "/assets/images/avatars/user.webp";
    if ("dob" in req.user) {
        num = Date.parse(req.user.dob);
        req.user.dob = new Date(num).toISOString().split("T")[0];
    }
        let keys = Object.keys(req.user);
        userprofile = {};
    await keys.forEach(async key => {
        if (key == "_id" || key == "__v") return false;
        val = req.user[key];
        if (typeof val == "string")
            if (mongoose.isValidObjectId(val)) {
                req.user[key] = await ProfileOptions.findById(val);
            }
    });
    
    // Checking Profile Status
    profileCategories = JSON.parse(JSON.stringify(await Profiles.find({}, { target: "$uri", name: 1, icon: 1, _id: 0, questions: 1 })));
    for (let index = 0; index < profileCategories.length; index++) {
        const profile = profileCategories[index];
        
        marks = {
            total: 0,
            scored: 0
        }
        for (let j = 0; j < profile.questions.length; j++) {
            const question = profile.questions[j];
            marks.total++;
            if (question.name in req.user) marks.scored++;
        }
        profileCategories[index]['completed'] = Math.round((marks.scored * 100) / (marks.total));
        profileCategories[index]['marks'] = marks;
    }
    req.user.profileCategories = profileCategories;
    console.log(req.user._id.toString());
    req.user.availableSurveys = await Survey.find({
        completed: {
            $ne: req.user._id
        },
        availableFor:
        {
            $in: [req.user._id.toString(), "all"]
        }
    }, {
        name: 1,
        uri: 1,
        summary: 1,
        source: 1,
        category: 1,
        surveyPoints: 1,
        surveyID: 1,
        source: 1,
        completed: 1,
        availableFor: 1
    }).exec();
    req.user.summary = [
        {
            name: "Available Surveys",
            info: [
                {
                    name: "In House Survey",
                    icon: "/img/inhouse.png",
                    count: req.user.availableSurveys.filter(survey => survey.source == "inhouse").length,
                    target: "#available-survey"
                },
                {
                    name: "External Survey",
                    icon: "/img/external.png",
                    count: req.user.availableSurveys.filter(survey => survey.source == "external").length,
                    target: "#available-survey"
                },
                {
                    name: "Survey Participations",
                    icon: "/img/participation.png",
                    count: 0,//req.user.participations.length||0,
                    target: "#available-survey"
                }
            ]
        },
        {
            name: "Survey History",
            info: [
                {},
                {},
                {}
            ]
        },
        {
            name: "Claimed History",
            info: [
                {},
                {},
                {}
            ]
        }
    ];

    next();
}

module.exports = router;