const router = require("express").Router();
const mongoose = require("mongoose");
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));

router.get("/addData",(req,res)=>{

});
router.route("/:component")
    .get((req, res) => {
        ProfileOptions.find({ name: req.params.component }).then(options => {
            res.json({ status: "success", data: options })
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        })
    })
    .post(async (req, res) => {
        let dependents=[];
        await Object.keys(req.body).forEach(
            key => {
                dependents.push(req.body[key]);
            }
        );
        ProfileOptions.find({ name: req.params.component}).where("dependents").has(dependents).then(data => {
            console.log(data);
            res.json({status:"success",data:data});
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        });
    });

module.exports = router;