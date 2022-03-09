const mongoose = require("mongoose");
const router=require('express').Router();
const User = mongoose.model("user", require("../modals/user"));
const Profile=mongoose.model("profile",require("../modals/profiles"));
router.get("/",(req,res)=>{
    res.redirect("/user/dashboard");
});
router.route("/:surveyName")
    .get(async (req,res)=>{
        surveyname=req.params.surveyName;
        survey=await Profile.findOne({uri:surveyname});
        const info={page:{title:`${survey.name} Survey`,icon:`${survey.icon}`},user:req.user,survey:survey};        
        console.log(info.survey.pages[1]);
        res.render("survey.twig",info);
    })
    .post(async (req,res)=>{
        let user=await User.findOneAndUpdate({_id:req.user._id},{$set:req.body});
        console.log(user);
        res.json({success:true});
    })
module.exports=router;