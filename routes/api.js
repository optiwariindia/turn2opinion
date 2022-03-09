const router = require("express").Router();
const mongoose = require("mongoose");
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));

router.get("/addData", (req, res) => {
    const profileAns = JSON.parse(require("fs").readFileSync("./databank/profileAnswers.json"));
    let que = Object.keys(profileAns);
    que.forEach(element => {
        profileAns[element].forEach(Ans => {
            const profileOption = new ProfileOptions({
                name: element,
                label: Ans
            });
            profileOption.save().then(option => { console.log(option); }).catch(err => { console.log(err); });
        });
    });
    res.json(profileAns);
});
router.route("/professions")
    .get((req, res) => {
        professions=require("fs").readFileSync("./databank/professions.json");
        res.json(JSON.parse(professions))
    });
router.get("/professions/industry",async (req,res)=>{
    professions=JSON.parse(require("fs").readFileSync("./databank/professions.json"));
    // console.log(professions);
    // return;
    let industry=[];
    await professions.forEach(e=>{
        if(industry.indexOf(e.Industry)!==-1)return ;
        industry.push(e.Industry)
    })
    res.json(industry);
})
router.get("/professions/:industry",async (req,res)=>{
    professions=JSON.parse(require("fs").readFileSync("./databank/professions.json")).filter(e=>e.Industry===req.params.industry);
    let department=[];
    await professions.forEach(e=>{
        if(department.indexOf(e.Department)!==-1)return ;
        department.push(e.Department)
    })
    res.json(department);
})
router.get("/professions/:industry/:department",async (req,res)=>{
    professions=JSON.parse(require("fs").readFileSync("./databank/professions.json")).filter(e=>(e.Industry===req.params.industry && e.Department===req.params.department)).map(e=>e.Jobrole);
    // await professions.forEach(e=>{
    //     if(department.indexOf(e.Department)!==-1)return ;
    //     department.push(e.Department)
    // })
    res.json(professions);
})
router.post("/zone",async (req,res)=>{
    console.log("This function is called");
    let dependency = [];
        await Object.keys(req.body).forEach(
            key => {
                dependency.push(`${req.body[key]}`);
            }
        );
        // console.log({dependency:mongoose.ObjectId(dependency[0])});
        ProfileOptions.find({dependency:mongoose.Types.ObjectId(dependency[0])}).then(data => {
            console.log(data);
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
})
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
        options = await ProfileOptions.find({ name: req.params.component });
        data = options;
        selected = options.filter(info => (info._id == req.params.id));
        res.json({ status: "success", data: data, selected: selected });
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