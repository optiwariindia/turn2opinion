const router = require("express").Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: process.env.fb_client_id,
    clientSecret: process.env.fb_client_secret,
    callbackURL: `${process.env.site}/social/facebook/callback`
}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    done(null, profile);
}))


router.route("/login/facebook").get(passport.authenticate("facebook",{
    scope: ["email"]
}))

router.get("/facebook/callback", passport.authenticate("facebook", {
    failureRedirect: "/facebook/failure"
})
    , (req, res) => {
        console.log(req.user);
        res.redirect("/");
    });
module.exports = router;