const { randomInt } = require('crypto');
const twig = require('twig');
let captchakey = process.env.google_captcha_key;
const homepage=(req, res) => {
    journey =
        ["Create a free account via your active E-mail ID & valid Contact Number",
            "You will receive a verification link to verify your email and contact number with OTP.",
            "After verify you will be able to access the available surveys.",
            "To earn more rewards and to have access maximum surveys per week you need to complete all your Profiles Particulars.",
            "As soon as you complete your profiles you would be able to achieve your threshhold amount to claim.",
            "Once you achieve your threshold you will be able to claim your rewards money via Paypal, Gift-vouchers , or it can be directly transfers to your account as per request and availability."];
    passport = req.session.passport || null;
    if (passport != null) {
        user = {
            fn: passport.user._json.given_name || passport.user.displayName.split(" ")[0] || "",
            ln: passport.user._json.family_name || passport.user.displayName.split(" ")[1] || "",
            email: passport.user._json.email || passport.user.emails || ""
        }
        switch (typeof user.email) {
            case "object":
                if ("0" in user.email) {
                    user.email = user.email["0"];
                }
                if ("value" in user.email) {
                    user.email = user.email.value;
                }
                break;

            default:
                break;
        }
    }
    else user = {};

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
    today = new Date();
    counters = [
        {
            title: "Panellist registered till now",
            count: 498099 + (Date.now() - project.startDate) / 3600000,
        },
        {
            title: "Incentives released in April",
            count: (14884) * ((today.getDate()+today.getHours()/24) / 30),
        },
        {
            title: "Monthly Available Surveys",
            count: 50,
        },
        {
            title: "Completed Surveys",
            count: 25264 + (Date.now() - project.startDate) / (3600000 * 4)
        },
    ]
    let info={ captchakey, project, slider, counters, testimonials, user, journey, ...req.extrainfo||{}}
// console.log(req.extrainfo);
    
    res.render("index", info);
}
module.exports = homepage;