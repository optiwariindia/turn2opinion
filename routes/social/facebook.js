const router = require("express").Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;



passport.use(new FacebookStrategy({
    clientID: process.env.fb_client_id,
    clientSecret: process.env.fb_client_secret,
    callbackURL: `${process.env.site}/social/facebook/callback`,
    profileFields: ['id', 'displayName', 'email','gender']
}, (accessToken, refreshToken, profile, done) => {
    console.log({AccessToken:accessToken,RefreshToken:refreshToken,Profile:profile});
    done(null, profile);
}))


router.route("/login").get(passport.authenticate("facebook",{
    scope: ["public_profile","email"]
}))

router.get("/callback", passport.authenticate("facebook", {
    failureRedirect: "/failure",
    successRedirect: "/"
}))
module.exports = router;