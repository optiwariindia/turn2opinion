const router = require('express').Router();
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const User = mongoose.model("user", require("../modals/user"));
const EMail=require("./email");
const email=require("../service/email");
const twig=require("twig");
const user = require('../modals/user');


router.use( session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }));
// router.use("/profile", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }));
// router.use("/welcome", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }));
// router.use("/history", session({ secret: 't2o', resave: false, saveUninitialized: false, cookie: { maxAge: 60 * 60 * 24 * 30, secure: false } }))
    router.use("/history", getUserInfo, userDetails, require("./history"));
// Validation Routes
router.route("/validate/:field")
.post((req, res) => {
    switch (req.params.field) {
        case "email":
            if(!email.validate(req.body.email,(status,message)=>{
                if(status=="error"){
                    res.json({"status": "error", "message": message});
                    return false;
                }
                User.findOne({ email: req.body.emaill }).then(user => {
                    if (user) {
                    res.json({"status": "error", "message": "Already registered"});
                    return false;
                    }
                    res.json({"status": "success", "message": "Email is available"});
                    return true;
                })
            }))
            break;
        case "phone":
            phone=req.body.phone;
            User.findOne({ phone: phone }).then(user => {
                if (user) {
                res.json({"status": "error", "message": "Already registered"});
                return false;
                }
                res.json({"status": "success", "message": "Phone is available"});
                return true;
            });
            break;
        default:
            break;
    }
})
router
.route("/forgot")
.get((req, res) => {
    res.render("index.twig",{form:"forgot"});
})
.post((req,res)=>{
    User.findOne({email:req.body.email}).then(user=>{
        if(user.security.answer == req.body.security){
            twig.renderFile("mailers/template.twig",{fn:user.fn,message:"forgotPassword",reset_link:process.env.site+"/user/pwreset/"+user._id},(e,h)=>{
                email.sendEmail(user.email,"Turn2Opinion: Reset Password",h,h);
                res.json({"status":"ok","user":user});
            });
        }else{
            res.json({"status":"error","message":"Security answer is incorrect"});
        }
    });
    // res.json({"status":"error","message":"Not implemented yet"});
})
router.route("/securityquestion")
.post((req, res) => {
    User.findOne({ email: req.body.email,security:{answer:req.body.answer} }).then(user => {console.log(user);});
    res.json({"status": "ok", "question": "In what city were you born?"});
})
router.post("/new", (req, res) => {
    new User({
        fn: req.body.fn,
        ln: req.body.ln,
        email: req.body.email,
        phone: req.body.phone,
        gender:req.body.gender,
        cn:req.body.cn,
        cntry:req.body.cntry,
        timezone:req.body.timezone
    }).save().then(usr=>{
        twig.renderFile("mailers/template.twig",{message:"activation",site:process.env.site,fn:usr.fn,id:usr._id},(e,h)=>{
            console.log(e);
            email.sendEmail(usr.email,"Activate Your Turn2Opinion Account","",h);
            res.json({status:"ok",user:usr});
        })
    }).catch(err=>{
        res.json({status:"errror",message:err.message});
        return false;
    });    
});
router.post("/login", (req, res) => {
    User.find({ email: req.body.user, password: req.body.pass }).then(user=>{
        if(user.length===1){
            req.session.user=user[0];
            res.json({"status":"ok","user":user[0]});
        }
        else
        res.json({"status":"error","message":"Invalid Credentials"});
    }).catch(err=>{
        res.json({"status":"error",message:err.message});
    })
})
router.route("/verify/:id")
.get((req, res) => {
    securityqs=JSON.parse(require("fs").readFileSync("./dummyData/security.json"));
    User.findById(req.params.id).then(user=>{user.verified.email=true; user.save();});
    res.render("index.twig", {form:"setpass",id:req.params.id,securityqs});
})
router.route("/resetpass/:id")
.get((req,res)=>{
    res.render("index.twig", {form:"resetpass",id:req.params.id});
})
.post((req,res)=>{
    console.log(req.params.id);
    User.findById(req.params.id).then(u=>{
        console.log(u);
        u.password=req.body.pass;
        u.save().then(usr=>{
            req.session.user=usr;
            console.log(usr);
            res.json({"status":"ok","user":usr});
        })
    }).catch(err=>{
        res.json({"status":"error",message:err.message});
    })
})
router.post("/setpass",(req,res)=>{
    User.findById(req.body.id).then(user=>{
        user.password=req.body.pass;
        user.security.question=req.body.secque;
        user.security.answer=req.body.ans;
        user.save().then(usr=>{
            req.session.user=usr;
            console.log(usr);
            res.json({"status":"ok","user":usr});
            // res.redirect("/user/dashboard");
        })
    }).catch(err=>{
        res.json({"status":"error",message:err.message});
    })
})
router.route("/welcome")
    .get(getUserInfo, userDetails, (req, res) => {
        res.render("welcome.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
    })
    .post((req, res) => {
        User.findById(req.body.userId).exec().then(user => {
            terms = Object.keys(req.body).filter(key => key.indexOf("userid") === -1);
            User.findOneAndUpdate({ _id: req.body.userid }, { $set: { terms: terms } }).then(user => {
                User.findById(user._id).exec().then(user => {req.session.user=user; 
                    res.redirect("/user/welcome");
                });
            })
        })
    });
router.route("/dashboard")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            let filters = [];
            req.user.availableSurveys.forEach(survey => {
                if (survey.sstat !== "" && (filters.indexOf(survey.sstat) === -1))
                    filters.push(survey.sstat);
                if (survey.sact !== "" && (filters.indexOf(survey.sact) === -1))
                    filters.push(survey.sact);
            })
            res.render("dashboard.twig", { user: req.user, filters });
        })
app.use(fileUpload());
router.route("/profile/")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            res.render("profile.twig", { user: req.user, page: { title: "Profile", icon: "profile.png" } });
        })
    .post(getUserInfo, (req, res) => {
        type = req.files.propic.mimetype.split("/");
        if (type[0] !== "image") {
            res.json({ "error": "Only Image Files are allowed" });
            return false;
        }
        req.files.propic.mv(`public/assets/images/avatars/${req.user._id}.${type[1]}`);
        User.findOne({ email: req.user.email }).then(user => {
            user.propic = `/assets/images/avatars/${req.user._id}.${type[1]}`;
            user.save();
            res.redirect("/user/profile");
        })
    })
router.route("/profile/:profilename")
    .get(
        getUserInfo,
        userDetails,
        (req, res) => {
            req.user.basicpro = JSON.parse(require("fs").readFileSync("./dummyData/profile.basic.json"));
            res.render("form.twig", { user: req.user, page: { title: "Basic Profile", icon: "basic-profile.png" } });
            // res.json(req.user);
        })
function getUserInfo(req, res, next) {
    if (("user" in req.session)) {
        req.user = req.session.user;
        console.log("User found in session variable");
        next();
        return;
    }
    res.redirect("/");
    /* User.findOne({ email: "om.tiwari@frequentresearch.com" })
        .then(user => {
            user['name'] = user.fn + " " + user.ln;
            if (user.terms.length === 0) {
                if (req.url.indexOf("/dashboard") !== 0) {
                    res.redirect("/user/dashboard");
                    return;
                }
            }
            if (user.propic === undefined) user.propic = "/assets/images/avatars/user.webp";
            // Dummy Data about User
            req.user = user;
            req.session.user = user;
            next();
        })
        .catch(err => {
            console.log("User not found in database");
            console.log(err);
            res.sendStatus(404).render("/404.twig", { error: "User Unavilable at the moment" });
        }) */
}
function userDetails(req, res, next) {
    req.user.statusSummary = JSON.parse(require("fs").readFileSync("./dummyData/statusSummary.json"));
    req.user.profileCategories = JSON.parse(require("fs").readFileSync("./dummyData/profileCategoires.json"));
    req.user.summary = JSON.parse(require("fs").readFileSync("./dummyData/summary.json"));
    req.user.availableSurveys = JSON.parse(require("fs").readFileSync("./dummyData/availableSurvey.json"));
    next();
}
module.exports = router;