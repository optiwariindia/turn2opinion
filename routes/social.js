const router=require("express").Router();
const passport=require("passport");

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.use("/facebook",require("./social/facebook"));
router.use("/twitter",require("./social/twitter"));
router.use("/linkedin",require("./social/linkedin"));
router.use("/google",require("./social/google"));

module.exports=router;