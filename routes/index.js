const { randomInt } = require('crypto');
const twig = require('twig');
let captchakey =process.env.google_captcha_key;
const router = require('express').Router();
router.route("/")
    .get((req, res) => {
        passport=req.session.passport||null;
        if(passport!=null){
        user={
            fn:passport.user.displayName.split(" ")[0]||"",
            ln:passport.user.displayName.split(" ")[1]||passport.user.name.familyName||"",
            // email:passport.user.emails[0].value||"",
            phone:passport.user.phoneNumber||"",
            gender:passport.user.gender||""
        }
    }
    else user={};
    console.log(user);
        slider = [{
            h1: "We value your feedback",
            h2: "your opinion gets rewarded",
            p: "Our service will give you more opportunities to enhance your knowledge and experience. Our community gives a high value monitory rewards on sharing your thoghts knowldege and experiences."
        }, {
            h1: "Let's make your opinion reach the world",
            h2: "Earn more & more money with us",
            p: "Your experiences and loyal feedback will help Global Industrial Clients to improve their product and services with a new innovative approach"
        },
        {
            h1: "Make fast and easy money with us",
            h2: "Simple way to generate more cash rewards",
            p: "We have a very easy process to make you rewarded for your efforts and time with a high value incentives in just a very simple three step process i.e. → Free registration, → Quick survey Participation and → Earn Rewards"
        }];
        project = JSON.parse(require("fs").readFileSync("./databank/project.json"));
        testimonials = JSON.parse(require("fs").readFileSync("./dummyData/testimonials.json"));
        today=new Date();
        counters=[
            {
                title:"Panellist registered",
                count:498099 + (Date.now()-project.startDate)/3600000,
            },
            {
                title:"Incentives released",
                count:(498099 + (Date.now()-project.startDate)/3600000)*randomInt(1,20)/10,
            },
            {
                title:"Monthly Available Surveys",
                count:50,
            },
            {
                title:"Completed Surveys",
                count:25264 + (Date.now()-project.startDate)/(3600000*4)
            },
        ]
        res.render("index", { captchakey, project,slider,counters,testimonials,user});
    })
    .post((req, res) => {
        res.send("post");
    })
    .put((req, res) => {
        res.send("put");
    })
    .patch((req, res) => {
        res.send("patch");
    })
    .delete((req, res) => {
        res.send("delete");
    });
module.exports = router;