const mongoose = require("mongoose");
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const router = require("express").Router();
const User = mongoose.model("user", require("../modals/user"));
router.route("/")
    .get((req, res) => {
        res.render("profile.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
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
                console.log(usr);
                req.session.user = usr;
                res.redirect("/user/profile");
            });
        })
    })
router.use("/:profilename", getProfileInfo);
router.route("/:profilename")
    .get((req, res) => {
        console.log(req.params.profilename);
        let pageinfo = {};
        req.user.profileCategories.map(e => {
            if (e.target === req.params.profilename) { e.active = true; pageinfo = e; }
            return e;
        })

        // req.user.basicpro = JSON.parse(require("fs").readFileSync("./dummyData/profile.basic.json"));
        res.render("form.twig", {
            user: req.user, profile: req.profile, page: {
                title: pageinfo.name,
                icon: pageinfo.icon,
                active: pageinfo.active
            }
        });
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
        profiles = await Profiles.find({ uri: req.params.profilename });
        if (profiles.length === 0) {
            req.profile = [];
            next();
            return;
        }
        req.profile = profiles[0];
        next();
        return;

    }
    catch (err) {
        res.json({ status: "error", message: err.message });
    }
}