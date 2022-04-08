const fs=require("fs")
const mongoose = require("mongoose");
const Profiles = mongoose.model("profiles", require("../modals/profiles"));
const router = require("express").Router();
const User = mongoose.model("user", require("../modals/user"));
const Survey = mongoose.model("survey", require("../modals/survey"));
router.route("/")
    .get(async (req, res) => {
        attempts =req.user.attempts;
        
        survey = {
            completed: Array.from(attempts).filter(e => e.status == "completed").length,
            disqualified: Array.from(attempts).filter(e => e.status == "disqualified").length,
            total: attempts.length,
            claimed: Array.from(req.redeem).reduce((a, b) => a + parseInt(b.amount.replace(/[^\d.-]/g, '')), 0)
        }
        redeem = await Array.from(req.redeem).map(e => {
            info=JSON.parse(JSON.stringify(e));
            info['rDate'] = new Date(e.redeemDate).toDateString();
            info['txnid'] = (e.redeemDate > new Date())?"-":"TXN_"+Date.parse(e.redeemDate)/1000;
            info['pmode']=(e.paymentMethod.paypal)?`PayPal:${e.paymentMethod.paypal}`:`UPI:${e.paymentMethod.upi}`;
            
            return info;
        })
        let data=[];
        for (let index = 0; index < attempts.length; index++) {
            const attempt = attempts[index];
            let info = JSON.parse(JSON.stringify(attempt));
            let temp=await Survey.find({_id:attempt.survey},{pages:0,completed:0,active:0});
            info.survey=temp[0]||{};
            if(info.status=="disqualified")
                info.reason=" Closed before completion";
            if(["disqualified","overquota"].indexOf(info.status)!=  -1)
            data.push(info);            
        }
// res.json(data);return;
        res.render("profile.twig", {
            rejected:data,
            redeem,
            survey,
            conversion: process.env.conversion,
            threshold: process.env.threshold,
            user: req.user,
            page: { title: "Profile", icon: "profile.png" },
            profilestatus: 100 * (req.user.profileCategories.filter(e => e.completed == 100).length) / (req.user.profileCategories.length)
        });
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
                // console.log(usr);
                req.session.user = usr;
                res.redirect("/user/profile");
            });
        })
    })
router.get("/automobile",async (req,res)=>{
     vehichles=fs.readFileSync("databank/automobile.json").toString();
     vehichles=JSON.parse(vehichles);
     insurers=fs.readFileSync("databank/autoInsurance.json").toString();
    insurers=JSON.parse(insurers);
     let info = {
        user: req.user, profile: "automobile", page: {
            title:"Automobile profile",
            icon:"automotive-profile.png"
        },
        vehichles,
        insurers
    };
    res.render("autoprofile.twig", info);
})
router.use("/:profilename", getProfileInfo);
router.route("/:profilename")
    .get((req, res) => {
        let pageinfo = {};
        req.user.profileCategories.map(e => {
            if (e.target === req.params.profilename) { e.active = true; pageinfo = e; }
            return e;
        })
        let info = {
            user: req.user, profile: req.profile, page: {
                title: pageinfo.name,
                icon: pageinfo.icon,
                active: pageinfo.active
            }
        };
        if ("edit" in req.query) info["edit"] = true;
        
        res.render("profileInfo.twig", info);
    })
    .post(async (req, res) => {
        try {
            profile=await Profiles.findOne({uri:req.params.profilename},{name:1});
            user = await User.findById(req.user._id)
            await user.updateOne(req.body);
            user = await User.findById(req.user._id)
            req.session.user = user;
            res.json({ status: "success", message: `<h2>Thank you for Completing you ${profile.name} Profile</h2> <p>You have earned 85 Pts. To earn more please complete your renaming profiles to reach your threshold points to claim your rewards.</p>` });
        }
        catch (err) {
            res.json({ status: "error", message: err.message });
        }
    })
module.exports = router;

async function getProfileInfo(req, res, next) {
    try {
        user = req.user;
        profiles = await Profiles.find({ uri: req.params.profilename });
        if (profiles.length === 0) {
            req.profile = [];
            next();
            return;
        }
        profile = JSON.parse(JSON.stringify(profiles[0]));
        for (let index = 0; index < profile.questions.length; index++) {
            if ([null, undefined, ""].indexOf(user[profile.questions[index].name]) === -1) {
                profile.questions[index]["ans"] = user[profile.questions[index].name];
            } else {
                profile.pages = profile.pages.map(e => {
                    e.indexOf(index) > -1 ? e.splice(e.indexOf(index), 1) : null;
                    return e;
                });
            }
        }
        pages = [];
        profile.pages.forEach(element => {
            if (element.length > 0) pages.push(element);
        });
        profile.pages = pages;
        if ("edit" in req.query)
            req.profile = profiles[0];
        else
            req.profile = profile;
        if (req.profile.pages.length == 0)
            req.mode = "edit";

        next();
        return;

    }
    catch (err) {
        res.json({ status: "error", message: err.message });
    }
}