const router = require("express").Router();
const mongoose = require('mongoose');
const passport = require("passport");
const User = mongoose.model("users", require("../modals/user"));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());
router.get("/confirm", async (req, res) => {
    if (!("session" in req && "passport" in req.session && "user" in req.session.passport))
        return res.redirect("/");
    auth = {
        provider: req.session.passport.user.provider,
        id: req.session.passport.user.id
    };
    try {
        user = await User.find({ "social.provider": auth.provider, "social.id": auth.id });
        if (user.length == 0) {
            user = await User.find({ email: req.session.passport.user.emails[0].value });
            if (user.length == 0)
                return res.redirect("/");
        }
        req.session.user = user[0];
        req.session.user.social.push(auth);
        await req.session.user.save();
        res.redirect("/user/dashboard");
    } catch (error) {
        res.json(error);
    }
})
router.use("/facebook", require("./social/facebook"));
router.use("/twitter", require("./social/twitter"));
router.use("/linkedin", require("./social/linkedin"));
router.use("/google", require("./social/google"));

module.exports = router;