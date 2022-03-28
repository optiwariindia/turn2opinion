const mongoose = require("mongoose");
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const router = require("express").Router();
const User = mongoose.model("user", require("../modals/user"));
const request=require("request");
router.route("/")
    .get(async (req, res) => {
        console.log(user.survey);
        survey={
            completed:Array.from(user.survey).filter(e=>e.status=="completed").length,
            disqualified:Array.from(user.survey).filter(e=>e.status=="disqualified").length,
            pending:Array.from(user.survey).filter(e=>e.status=="").length,
            total:Array.from(user.survey).length
        }
        res.render("profile.twig", { 
            survey,
            conversion:process.env.conversion,
            threshold:process.env.threshold,
            user: req.user,
            page: { title: "Profile", icon: "profile.png" }
        });
    })
    .post((req, res) => {
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
router.use("/:profilename", getProfileInfo);
router.route("/:profilename")
    .get((req, res) => {
        let pageinfo = {};
        // console.log(req.user);
        req.user.profileCategories.map(e => {
            if (e.target === req.params.profilename) { e.active = true; pageinfo = e; }
            return e;
        })
        // console.log(req.query);
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
            user = await User.findById(req.user._id)
            user = await user.updateOne(req.body);
            req.session.user = user;
            res.json({ status: "success", message: "Profile Updated" });
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
            req.mode="edit";
            
        next();
        return;

    }
    catch (err) {
        res.json({ status: "error", message: err.message });
    }
}