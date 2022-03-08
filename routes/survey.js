const router=require('express').Router();
router.get("/",(req,res)=>{
    res.redirect("/user/dashboard");
});
router.route("/:surveyName")
    .get((req,res)=>{
        surveyname=req.params.surveyName;
        let file=`./dummyData/${surveyname}.json`;
        if(require("fs").existsSync(file))
            survey=JSON.parse(require("fs").readFileSync(file));
        else
            survey={};
        const info={page:{title:`${survey.name} Survey`,icon:`${survey.icon}`},user:req.user,survey:survey};
        
        res.render("survey.twig",info);
    })
module.exports=router;