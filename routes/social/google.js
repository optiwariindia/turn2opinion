const router=require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



passport.use(new GoogleStrategy({
    clientID: process.env.google_client_id,
    clientSecret: process.env.google_client_secret,
    callbackURL: `${process.env.site}/social/google/callback`,
    scope: ["https://www.googleapis.com/auth/userinfo.email"]
}, (accessToken, refreshToken, profile, done) => {
    console.log({AccessToken:accessToken,RefreshToken:refreshToken,Profile:profile});
    done(null, profile);
}))


router.route("/login").get(passport.authenticate("google",{
    scope: ["profile","email"]
}))

router.get("/callback", passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/"
}))
module.exports=router;