const mongoose = require("mongoose");
const router=require('express').Router();
const User = mongoose.model("user", require("../modals/user"));
const Survey=mongoose.model("survey",require("../modals/survey"));
router.get("/",(req,res)=>{
    res.redirect("/user/dashboard");
});
router.route("/:surveyName")
    .get(async (req,res)=>{
        surveyname=req.params.surveyName;
        survey=await Survey.findOne({uri:surveyname});
        if(survey){
            console.log(survey.pages)
        }
        const info={page:{title:`${survey.name} Survey`,icon:`${survey.icon}`},user:req.user,survey:survey};        
        res.render("survey.twig",info);
    })
    .post(async (req,res)=>{
        let user=await User.findOneAndUpdate({_id:req.user._id},{$set:req.body});
        console.log(user);
        res.json({success:true});
    })
module.exports=router;