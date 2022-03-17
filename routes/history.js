const router = require('express').Router();

router.use("/:page",(req,res)=>{
    let info=JSON.parse(require("fs").readFileSync("./dummyData/history.json"));
    console.log(info[req.params.page]);
    res.render("table.twig",{page:req.params.page,user:req.user,info:info[req.params.page]});
});
module.exports=router;