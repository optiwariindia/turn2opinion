const router = require("express").Router();
const mongoose = require("mongoose");
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));

router.get("/addData", (req, res) => {
    const profileAns = JSON.parse(require("fs").readFileSync("./databank/profileAnswers.json"));
    let que = Object.keys(profileAns);
    que.forEach(element => {
        profileAns[element].forEach(Ans => {
            const profileOption = new ProfileOptions({
                name:element,
                label:Ans
            });
            profileOption.save().then(option=>{console.log(option);}).catch(err=>{console.log(err);});
        });
        // console.log(element);
        // console.log(profileAns[element]);
    });
    res.json(profileAns);
});
router.route("/:component")
    .get((req, res) => {
        console.log(`Requesting ${req.params.component}`);
        ProfileOptions.find({ name: req.params.component }).then(options => {
            res.json({ status: "success", data: options })
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        })
    })
    .post(async (req, res) => {
        let dependency = [];
        await Object.keys(req.body).forEach(
            key => {
                dependency.push(`${req.body[key]}`);
            }
        );
        console.log(dependency);
        ProfileOptions.find({ name: req.params.component }).then(data => {
            data = data.filter(info => {
                out = true;
                for (let i = 0; i < dependency.length; i++) {
                    out = out && (info.dependency.indexOf(dependency[i]) !== -1);

                }
                return out;
            });

            res.json({ status: "success", data: data, length: data.length });
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        });
    });
    router.route("/:component/:id")
    .get(async (req, res) => {
        console.log(`Requesting ${req.params.id} from ${req.params.component}`);
        options=await ProfileOptions.find({name:req.params.component});
        data=options;
        selected=options.filter(info=>(info._id==req.params.id));
        res.json({ status: "success", data:data, selected:selected });
    })
    .post(async (req, res) => {
        let dependency = [];
        await Object.keys(req.body).forEach(
            key => {
                dependency.push(`${req.body[key]}`);
            }
        );
        console.log(dependency);
        ProfileOptions.find({ name: req.params.component }).then(data => {
            data = data.filter(info => {
                out = true;
                for (let i = 0; i < dependency.length; i++) {
                    out = out && (info.dependency.indexOf(dependency[i]) !== -1);

                }
                return out;
            });

            res.json({ status: "success", data: data, length: data.length });
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        });
    });

module.exports = router;