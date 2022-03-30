const router = require("express").Router();
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(new TwitterStrategy({
    consumerKey: process.env.twitter_client_id,
    consumerSecret: process.env.twitter_client_secret,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json",
    callbackURL: `${process.env.site}/social/twitter/callback`
}, (accessToken, refreshToken, profile, done) => {
    console.log({ AccessToken: accessToken, RefreshToken: refreshToken, Profile: profile });
    done(null, profile);
}))

router.route("/login").get(passport.authenticate("twitter", {
    state: "Authorized"
}))
router.route("/callback")
    .get(passport.authenticate("twitter", {
        failureRedirect: "/failure",
        successRedirect: "/"
    }))
module.exports = router;


/*
Auth.passport.use(new TwitterStrategy({
        consumerKey: config.get("authentication.twitter.consumerKey"),
        consumerSecret: config.get("authentication.twitter.consumerSecret"),
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        callbackURL: config.get("authentication.twitter.callbackURL")
    },
    function(token, tokenSecret, profile, done) {
        Login.findOrCreateUser(profile,function(err,user) {
            done(err,user);
        });
    }
));
*/