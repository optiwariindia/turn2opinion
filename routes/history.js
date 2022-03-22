const router = require('express').Router();
const mongoose=require("mongoose");
const Survey = mongoose.model("survey", require("../modals/survey"));

router.use("/:page",async (req,res)=>{
    let info=JSON.parse(require("fs").readFileSync("./dummyData/history.json"));
    switch(req.params.page){
        case "survey":
            data=[];
            temp=Array.from(req.user.attempts)
            for (let index = 0; index < temp.length; index++) {
                const element = temp[index];
                survey=await Survey.findById(element.survey,{name:1,icon:1,source:1,surveyID:1,surveyPoints:1});
                data.push([
                    survey.surveyID,
                    survey.name,
                    new Date(element.attemp.start).toLocaleString(),
                    element.status,
                    `${element.rewards} Pts.`
                ]);
            }
            info.survey.data=data;
            break;
        case "claimes":
            temp=Array.from(req.redeem);
            data=[];
            await temp.forEach(async e=>{
                paymethod={};
                await Object.keys(e.paymentMethod).forEach(async key=>{
                    pmethod={key:key,value:e.paymentMethod[key]};
                    if(pmethod.value!== undefined && pmethod.value.length>0)paymethod=pmethod;
                })
                
                data.push([
                    e.points,
                    e.amount,
                    `${paymethod.key}: ${paymethod.value}`,
                    new Date(e.redeemDate).toLocaleDateString(),
                    e.txnId
                ])
            })
            info.claimes.data=data;
            break;
    }
    res.render("table.twig",{page:req.params.page,user:req.user,info:info[req.params.page]});
});
module.exports=router;