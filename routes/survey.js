const router=require('express').Router();
router.get("/",(req,res)=>{
    res.redirect("/user/dashboard");
});
router.route("/:surveyName")
    .get((req,res)=>{
        survey=JSON.parse(require("fs").readFileSync("./dummyData/welcome.json"));
        console.log(survey);
        res.render("survey.twig",{page:{title:`${survey.name} Survey`,icon:`${survey.icon}`},user:req.user,survey:survey});
    })
module.exports=router;