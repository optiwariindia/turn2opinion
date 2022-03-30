const router = require("express").Router();
const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
passport.use(new LinkedInStrategy({
    clientID: process.env.linkedin_client_id,
    clientSecret: process.env.linkedin_client_secret,
    callbackURL: `${process.env.site}/social/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
    profileFields: ['id', 'displayName', 'email']
}, (accessToken, refreshToken, profile, done) => {
    console.log({ AccessToken: accessToken, RefreshToken: refreshToken, Profile: profile });
    done(null, profile);
}))

router.route("/login").get(passport.authenticate("linkedin", {
    state: "Authorized"
}))
router.route("/callback")
    .get(passport.authenticate("linkedin", {
        failureRedirect: "/failure",
        successRedirect: "/"
    }))
module.exports = router;
