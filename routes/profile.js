router = require("express").Router();
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
router.route("/:profilename")
    .get((req, res) => {
        console.log(req.params.profilename);
        let pageinfo = {};
        req.user.profileCategories.map(e => {
            if (e.target === req.params.profilename) { e.active = true; pageinfo = e; }
            return e;
        })
        
        req.user.basicpro = JSON.parse(require("fs").readFileSync("./dummyData/profile.basic.json"));
        res.render("form.twig", { user: req.user, page:{
            title: pageinfo.name,
            icon: pageinfo.icon,
            active: pageinfo.active
        }});
    })
    .post((req, res) => {
        console.log(req.body);
        console.log(req.params);
        console.log(req.session.user);
        res.json({ "status": "pending", "message": "Profile Unable to save your profile at this moment" });
    })
module.exports = router;