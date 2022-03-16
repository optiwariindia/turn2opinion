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
        survey=await Survey.findOne({uri:surveyname,availableFor:{$in:[req.user._id,"all"]},completed:{$nin:[req.user._id]}});
        if(survey){
        const info={page:{title:`${survey.name} Survey`,icon:`${survey.icon}`},user:req.user,survey:survey};        
        res.render("survey.twig",info);
        }else{
            res.redirect("/user/dashboard");
        }
    })
    .post(async (req,res)=>{
        surveyname=req.params.surveyName;
        let survey=await Survey.findOne({uri:surveyname,availableFor:{$in:[req.user._id,"all"]},completed:{$nin:[req.user._id]}});
        if(survey){
        let user=await User.findOneAndUpdate({_id:req.user._id},{$set:req.body});
        
            await survey.completed.push(user._id);
            await survey.save();
            user.points=user.points+survey.surveyPoints;
            user.save();
            req.session.user=user;
            res.json({status:"success",message:survey.thankyou});
            return ;
        }
        res.json({status:"error",message:"Some unexpected error occured"});
    })
module.exports=router;