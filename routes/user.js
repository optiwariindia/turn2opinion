const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = mongoose.model("users", require("../modals/user"));
const email = require("../service/email");
const twig = require("twig");
const fs = require("fs");
// const user = require('../modals/user');
const ProfileOptions = mongoose.model("profileoptions", require("../modals/profileOptions"));
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const Survey = mongoose.model("survey", require("../modals/survey"));
const Redeem = mongoose.model("redeem", require("../modals/redeem"));
const Attempt = mongoose.model("attempt", require("../modals/attempt"));
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})
router.post("/auth", (req, res) => {
    User.find({ email: req.body.user, password: req.body.pass, deletedOn: null }).then(user => {
        if (user.length === 1) {
            req.session.user = user[0];
            res.json({ "status": "ok", "user": user[0], "redirect": "/user/dashboard", "sessiontimeout": process.env.sessiontimeout });
        } else {
            res.json({ "status": "error", "message": "User not found", "info": user, "inputs": req.body });
        }
    })
})
router.use("/history", getUserInfo, userDetails, require("./history"));
router.post("/redeem", getUserInfo, userDetails, async (req, res) => {
    points = 1000;
    money = "$10.00USD";
    let = paymentMethod = {}
    await Object.keys(req.body).forEach(key => {
        switch (key) {
            case "paypalid":
                paymentMethod["paypal"] = req.body[key];
                break;
            case "upiid":
                paymentMethod["upi"] = req.body[key];
                break;
            default:
                paymentMethod["bank"] = {
                    ifsc: req.body["ifsc"],
                    account: req.body["account"],
                    name: req.body["acname"]
                }
                break;
        }
    })
    let redeemDate = new Date();
    let today = new Date();
    redeemDate.setDate(15);
    if (redeemDate < today)
        redeemDate.setMonth(redeemDate.getMonth() + 1);
    redeem = await Redeem.create({
        respondent: mongoose.Types.ObjectId(req.user._id),
        paymentMethod: paymentMethod,
        amount: money,
        points: points,
        redeemDate: redeemDate
    });
    redeem.save();
    user = req.user;
    twig.renderFile("mailers/template.twig", { message: "redeem", user: user, claim: redeem, money: money, points: points }, (e, h) => {
        email.sendEmail("om.tiwari@frequentresearch.com", `Turn2Opinion Panelist - ${user.name} - ${user.email} - Request for Panel Redemption`, "", h);
    });
    res.json({ status: "ok", message: `Your request to redeem ${points} equivalent to ${money} has been sent to corresponing department. You will be notified by email once it is credited in your account.` });
})
router.post("/validate/:field", (req, res) => {
    switch (req.params.field) {
        case "email":
            email.validate(req.body.email, async (resp) => {
                if (resp.status == "error") { res.json(resp); return; }
                info = await User.findOne({ email: req.body.email });
                if (info === null) {
                    res.json({ "status": "success", "message": "Email is available" });
                    return true;
                }
                res.json({ "status": "error", "message": "This e-mail is already registered with us." });
                return false;
            });
            break;
        case "phone":
            phone = req.body.phone;
            User.findOne({ phone: phone }).then(user => {
                if (user) {
                    res.json({ "status": "error", "message": "This Phone number is already registered with us." });
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
router.route("/delete")
    .get(async (req, res) => {
        fs.existsSync("../archives") || fs.mkdirSync("../archives");
        let text = JSON.stringify(req.session.user);
        console.log(text);
        await fs.writeFile(`../archives/${req.session.user._id}.json`, text, (e) => { console.log({ error: e }); });
        await User.updateOne({ _id: req.session.user._id }, { $set: { deletedOn: new Date() } });
        // req.session.destroy();
        res.redirect("/");
    })
    .delete(async (req, res) => {
        util = require("util");
        render = util.promisify(twig.renderFile);
        h = await render("mailers/template.twig", { user: req.session.user, message: "team/deleteAccount", link: process.env.site + "/user/delete?user=" + req.session.user._id });
        await email.sendEmail(process.env.team, "Turn2Opinion - Profile Deletion Request - Username - TP000001", h, h);
        h = await render("mailers/template.twig", { user: req.session.user, message: "deleteAccount", link: process.env.site + "/user/delete?user=" + req.session.user._id });
        await email.sendEmail(req.session.user.email, "Request to delete my account from Turn2Opinion", h, h);
        res.json({
            status: "ok",
            message: "Please check your email and follow the instructions to delete your account."
        })
    })
router.route("/changepassword")
    .post(async (req, res) => {
        info = req.body;
        if (info.oldpass !== req.session.user.password) {
            res.json({ "status": "error", "message": "Old Password is not matching with our record. Try Again." });
            return;
        }
        if (info.newpass !== info.cnfpass) {
            res.json({ "status": "error", "message": "New Password and Confirm Password are not matching. Try Again." });
            return;
        }
        await User.findOneAndUpdate({ _id: req.session.user._id }, { password: info.newpass })
        User.find({ _id: req.session.user._id }).then(user => {
            req.session.user = user;
            res.json({ "status": "success", "message": "Password has been changed successfully." });
        });

    });
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
router.post("/new", async (req, res) => {
    cntry = await ProfileOptions.findOne({iso2_code:req.body.cn});
    new User({
        fn: req.body.fn,
        ln: req.body.ln,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        cn: req.body.cn,
        cntry: req.body.cntry,
        timezone: req.body.timezone,
        country:cntry._id
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
router.get("/verify/:id", async (req, res) => {
    try{
        user= await User.findById(req.params.id);
        user.verified.email=true;
        user.save();
        securityqs = JSON.parse(require("fs").readFileSync("./databank/securityQuestions.json"));
        res.render("index.twig", { form: "setpass", id: req.params.id, securityqs });

    }catch(e){
        res.redirect("/");
        return;
    }
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
        let filters = [];
        user.survey = req.user.availableSurveys;
        res.render("dashboard.twig", { page: { title: "Dashboard", icon: "" }, user: req.user, filters, threshold: process.env.threshold, conversion: process.env.conversion });
    })
router.use(fileUpload())
    .use(getUserInfo, userDetails)
    .use("/profile", require("./profile"))
    .use("/survey", require("./survey"));


function getUserInfo(req, res, next) {
    if (("user" in req.session)) {
        if (req.session.user.deletedOn != null) { req.session.destroy(); res.redirect("/"); }
        req.user = req.session.user;
        next();
        return;
    } else {
        res.redirect("/");
    }
}
async function userDetails(req, res, next) {
    req.user.propic = req.user.propic || "/assets/images/avatars/user.webp";
    if ("dob" in req.user) {
        if (req.user.dob != null) {
            num = Date.parse(req.user.dob);
            req.user.dob = new Date(num).toISOString().split("T")[0];
        }
    }
    if ("createdAt" in req.user) {
        req.user.createdAt = new Date(req.user.createdAt);
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
    req.user.surveyTaken = await Survey.find({ completed: req.user._id }, { name: 1, uri: 1, summary: 1, source: 1, category: 1, surveyPoints: 1, surveyID: 1, source: 1 }).exec();
    req.user.attempts = Array.from(await Attempt.find({ respondent: req.user._id }));
    const today = new Date();
    req.redeem = Array.from(await Redeem.find({ user: req.user._id }).exec());
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
                    count: req.user.surveyTaken.length,
                    target: "/user/history/survey"
                }
            ]
        },
        {
            name: "Survey History",
            info: [
                {
                    "name": "Monthly Survey",
                    "icon": "/img/monthly.png",
                    "count": req.user.attempts.filter(attempt => {
                        atdate = new Date(attempt.attemp.start);
                        return atdate.getMonth() == today.getMonth();
                    }).length,
                    "target": "/user/history/survey/monthly"
                },
                {
                    "name": "Quarterly Survey",
                    "icon": "/img/quarterly.png",
                    "count": req.user.attempts.filter(attempt => {
                        atdate = new Date(attempt.attemp.start);
                        return Math.floor(atdate.getMonth() / 3) == Math.floor(today.getMonth() / 3);
                    }).length,
                    "target": "/user/history/survey/quarterly"
                },
                {
                    "name": "Yearly Survey",
                    "icon": "/img/yearly.png",
                    "count": req.user.attempts.filter(attempt => {
                        atdate = new Date(attempt.attemp.start);
                        return atdate.getYear() == today.getYear();
                    }).length,
                    "target": "/user/history/survey/yearly"
                }
            ]
        },
        {
            name: "Claimed History",
            info: [
                {
                    "name": "Monthly Claimed",
                    "icon": "/img/money.png",
                    "count": req.redeem.filter(redeem => {
                        rddate = new Date(redeem.redeemDate);
                        return rddate.getMonth() == today.getMonth();
                    }).reduce((acc, cur) => { return acc + cur.points }, 0) / process.env.conversion,
                    "target": "/user/history/claimes/monthly"
                },
                {
                    "name": "Quarterly Claimed",
                    "icon": "/img/money.png",
                    "count": req.redeem.filter(redeem => {
                        rddate = new Date(redeem.redeemDate);
                        return Math.floor(rddate.getMonth() / 3) == Math.floor(today.getMonth() / 3);
                    }).reduce((acc, cur) => { return acc + cur.points }, 0) / process.env.conversion,
                    "target": "/user/history/claimes/quarterly"
                },
                {
                    "name": "Yearly Claimed",
                    "icon": "/img/money.png",
                    "count": req.redeem.filter(redeem => {
                        rddate = new Date(redeem.redeemDate);
                        return rddate.getYear() == today.getYear();
                    }).reduce((acc, cur) => { return acc + cur.points }, 0) / process.env.conversion,
                    "target": "/user/history/claimes/yearly"
                }
            ]
        }
    ];

    next();
}

module.exports = router;