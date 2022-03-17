const mongoose = require("mongoose");
const router = require('express').Router();
const User = mongoose.model("user", require("../modals/user"));
const Survey = mongoose.model("survey", require("../modals/survey"));
const Attempt = mongoose.model("attempt", require("../modals/attempt"));
router.get("/", (req, res) => {
    res.redirect("/user/dashboard");
});
router.get("/history", async (req, res) => {
    
    attempts=[]
    info=await JSON.parse(JSON.stringify(await Attempt.find({user:req.user._id})))
    for(i=0;i<info.length;i++){
        attempt=info[i];
      survey=await Survey.find({_id:mongoose.Types.ObjectId(attempt.survey)},{name:1,source:1,uri:1,surveyID:1});
      attempt._survey=survey[0];
        attempts.push(attempt);    
    }
    req.user.history=attempts;
    res.render("table.twig",{page:"history",user:req.user,history:attempts});
});
router.route("/:surveyName")
    .get(async (req, res) => {
        surveyname = req.params.surveyName;
        survey = await Survey.findOne({ uri: surveyname, availableFor: { $in: [req.user._id, "all"] }, completed: { $nin: [req.user._id] } });
        if (survey) {
                attempt = await Attempt.findOneAndUpdate({respondent: req.user._id,
                    survey: survey._id},{
                    respondent: req.user._id,
                    survey: survey._id,
                    rewards: survey.surveyPoints,
                    source: "web",
                    category: survey.category,
                    attemp: {
                        start: new Date(),
                        from: req.socket.remoteAddress,
                        device: req.get("user-agent")
                    },
                    status: "pending"
                },{upsert:true});
            
            const info = { page: { title: `${survey.name} Survey`, icon: `${survey.icon}` }, user: req.user, survey: survey };
            res.render("survey.twig", info);
        } else {
            res.redirect("/user/dashboard");
        }
    })
    .post(async (req, res) => {
        surveyname = req.params.surveyName;
        let survey = await Survey.findOne({ uri: surveyname, availableFor: { $in: [req.user._id, "all"] }, completed: { $nin: [req.user._id] } });
        if (survey) {
            await Attempt.findOneAndUpdate({respondent: req.user._id,
                survey: survey._id},{
                    attempt:{
                        end: new Date()
                    },
                    status: "completed"
                });
            let user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: req.body });

            await survey.completed.push(user._id);
            await survey.save();
            user.points = user.points + survey.surveyPoints;
            user.save();
            req.session.user = user;
            res.json({ status: "success", message: survey.thankyou });
            return;
        }
        res.json({ status: "error", message: "Some unexpected error occured" });
    })
module.exports = router;