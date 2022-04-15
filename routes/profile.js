const fs = require("fs")
const mongoose = require("mongoose");
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const router = require("express").Router();
const User = mongoose.model("user", require("../modals/user"));
const Survey = mongoose.model("survey", require("../modals/survey"));
router.route("/")
    .get(async (req, res) => {
        attempts = req.user.attempts;

        survey = {
            completed: Array.from(attempts).filter(e => e.status == "completed").length,
            disqualified: Array.from(attempts).filter(e => e.status == "disqualified").length,
            total: attempts.length,
            claimed: Array.from(req.redeem).reduce((a, b) => a + parseInt(b.amount.replace(/[^\d.-]/g, '')), 0)
        }
        redeem = await Array.from(req.redeem).map(e => {
            info = JSON.parse(JSON.stringify(e));
            info['rDate'] = new Date(e.redeemDate).toDateString();
            info['txnid'] = (e.redeemDate > new Date()) ? "-" : "TXN_" + Date.parse(e.redeemDate) / 1000;
            info['pmode'] = (e.paymentMethod.paypal) ? `PayPal:${e.paymentMethod.paypal}` : `UPI:${e.paymentMethod.upi}`;

            return info;
        })
        let data = [];
        for (let index = 0; index < attempts.length; index++) {
            const attempt = attempts[index];
            let info = JSON.parse(JSON.stringify(attempt));
            let temp = await Survey.find({ _id: attempt.survey }, { pages: 0, completed: 0, active: 0 });
            info.survey = temp[0] || {};
            if (info.status == "disqualified")
                info.reason = " Closed before completion";
            if (["disqualified", "overquota"].indexOf(info.status) != -1)
                data.push(info);
        }
        // res.json(data);return;
        res.render("profile.twig", {
            rejected: data,
            redeem,
            survey,
            conversion: process.env.conversion,
            threshold: process.env.threshold,
            user: req.user,
            page: { title: "Profile", icon: "profile.png" },
            profilestatus: 100 * (req.user.profileCategories.filter(e => e.completed == 100).length) / (req.user.profileCategories.length)
        });
    })
    .post(async (req, res) => {
        if ("action" in req.body) {
            user = await User.findOne({
                _id: req.session.user._id
            });
            user.contact[req.body.platform] = req.body.userid;
            user.save();
            req.session.user = user;
            res.redirect("/user/profile");
            return;
        }
        type = req.files.propic.mimetype.split("/");
        if (type[0] !== "image") {
            res.json({ "error": "Only Image Files are allowed" });
            return false;
        }
        req.files.propic.mv(`public/assets/images/avatars/${req.user._id}.${type[1]}`);
        User.findOne({ email: req.user.email }).then(user => {
            user.propic = `/assets/images/avatars/${req.user._id}.${type[1]}`;
            user.save().then(usr => {
                // console.log(usr);
                req.session.user = usr;
                res.redirect("/user/profile");
            });
        })
    })
router.route("/automobile").get(autoprofile)
    .post(async (req, res,next) => {
        info = {};
        Object.keys(req.body).forEach(e => {
            temp = e.split("-");
            if (temp.length == 1)
                info[e] = req.body[e];
            else
                info[temp[0]]=(info[temp[0]==null])?{[temp[1]]:req.body[e]}:{...info[temp[0]], [temp[1]]:req.body[e]};
        })
        user=await User.findOne({ email: req.user.email });
        console.log(user);
        user.autoprofile=info;
        if (user.profiles.indexOf("automobile") == -1) {
            user.profiles.push("automobile");
            user.points = Number(user.points) + Number(process.env.profile);
            user.rating = Number(user.rating) + Number(0.1);
            await user.save();
            req.session.user = user;
            remaining=user.profiles.length < process.env.profilecount?"Please complete your remaining profiles.":"";
            message=`<h2>Thank you for Completing you Automobile Profile</h2> <p>You have earned ${process.env.profile} Pts. To earn more, & reach your threshold points to be claimed, ${remaining}</p>`;
        } else {
            await user.save();
            req.session.user = user;
            message=`<h2>Thank you for Updating you Automobile Profile</h2> <p>You have successfully updated your Automobile Profile.</p>`;
        }
        req.message=message;
        next();        
    }, autoprofile);
router.use("/:profilename", getProfileInfo);
router.route("/:profilename")
    .get((req, res) => {
        let pageinfo = {};
        req.user.profileCategories.map(e => {
            if (e.target === req.params.profilename) { e.active = true; pageinfo = e; }
            return e;
        })
        let info = {
            user: req.user, profile: req.profile, page: {
                title: pageinfo.name,
                icon: pageinfo.icon,
                active: pageinfo.active
            }
        };
        if ("edit" in req.query) info["edit"] = true;

        res.render("profileInfo.twig", info);
    })
    .post(async (req, res) => {
        try {
            profile = await Profiles.findOne({ uri: req.params.profilename }, { name: 1 });
            user = await User.findById(req.user._id)
            await user.updateOne(req.body);
            user = await User.findById(req.user._id)
            if (user.profiles.indexOf(req.params.profilename) == -1) {
                user.profiles.push(req.params.profilename);
                user.points = Number(user.points) + Number(process.env.profile);
                user.rating = Number(user.rating) + Number(0.1);
                user.save();
                req.session.user = user;
                remaining=user.profiles.length < process.env.profilecount?"Please complete your remaining profiles.":"";
                res.json({ status: "success", message: `<h2>Thank you for Completing you ${profile.name} Profile</h2> <p>You have earned ${process.env.profile} Pts. To earn more, & reach your threshold points to be claimed,${remaining}</p>` });
            } else {
                req.session.user = user;
                res.json({ status: "success", message: `<h2>Thank you for Updating you ${profile.name} Profile</h2> <p>You have successfully updated your ${profile.name}.</p>` });
            }
        }
        catch (err) {
            res.json({ status: "error", message: err.message });
        }
    })
module.exports = router;

async function getProfileInfo(req, res, next) {
    try {
        user = req.user;
        profiles = await Profiles.find({ uri: req.params.profilename });
        if (profiles.length === 0) {
            req.profile = [];
            next();
            return;
        }
        profile = JSON.parse(JSON.stringify(profiles[0]));
        for (let index = 0; index < profile.questions.length; index++) {
            if ([null, undefined, ""].indexOf(user[profile.questions[index].name]) === -1) {
                profile.questions[index]["ans"] = user[profile.questions[index].name];
            } else {
                profile.pages = profile.pages.map(e => {
                    e.indexOf(index) > -1 ? e.splice(e.indexOf(index), 1) : null;
                    return e;
                });
            }
        }
        pages = [];
        profile.pages.forEach(element => {
            if (element.length > 0) pages.push(element);
        });
        profile.pages = pages;
        if ("edit" in req.query)
            req.profile = profiles[0];
        else
            req.profile = profile;
        if (req.profile.pages.length == 0)
            req.mode = "edit";

        next();
        return;

    }
    catch (err) {
        res.json({ status: "error", message: err.message });
    }
}
async function autoprofile (req, res){
    vehichles = fs.readFileSync("databank/automobile.json").toString();
    vehichles = JSON.parse(vehichles);
    insurers = fs.readFileSync("databank/autoInsurance.json").toString();
    insurers = JSON.parse(insurers);
    popup=req.message||"";
    let info = {
        user: req.user, profile: "automobile", page: {
            title: "Automobile profile",
            icon: "automotive-profile.png"
        },
        vehichles,
        insurers,
        popup
    };
    res.render("autoprofile.twig", info);
}