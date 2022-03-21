const router = require("express").Router();
const mongoose = require("mongoose");
const Survey = mongoose.model("survey", require("../modals/survey"));
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));

const Profiles = mongoose.model("profiles", require("../modals/profiles"));

router.get("/addData", async (req, res) => {
  res.json({});
});
router.get("/profileStatus",async (req,res)=>{
profiles=Array.from(await Profiles.find({},{name:1,uri:1,questions:1}));
if(req.session.user === undefined){
  res.json({
    status: "error",
    message: "You are not logged in"
  });
  return;
}
let profileStatus=[];
for (let index = 0; index < profiles.length; index++) {
  const profile = profiles[index];
  let status=0;
  for (let qno = 0; qno < profile.questions.length; qno++) {  
    const question = profile.questions[qno]['name'];
    if(req.session.user[question]!==undefined){
      status++;
    }
  }
  profileStatus.push([profile.uri,status,profile.questions.length]);
}
res.json(profileStatus);
return;
res.json({});
})
router.route("/professions")
  .get((req, res) => {
    professions = require("fs").readFileSync("./databank/professions.json");
    res.json(JSON.parse(professions))
  });
router.get("/professions/industry", async (req, res) => {
  professions = JSON.parse(require("fs").readFileSync("./databank/professions.json"));
  // console.log(professions);
  // return;
  let industry = [];
  await professions.forEach(e => {
    if (industry.indexOf(e.Industry) !== -1) return;
    industry.push(e.Industry)
  })
  res.json(industry);
})
router.get("/professions/:industry", async (req, res) => {
  professions = JSON.parse(require("fs").readFileSync("./databank/professions.json")).filter(e => e.Industry === req.params.industry);
  let department = [];
  await professions.forEach(e => {
    if (department.indexOf(e.Department) !== -1) return;
    department.push(e.Department)
  })
  res.json(department);
})
router.get("/professions/:industry/:department", async (req, res) => {
  professions = JSON.parse(require("fs").readFileSync("./databank/professions.json")).filter(e => (e.Industry === req.params.industry && e.Department === req.params.department)).map(e => e.Jobrole);
  // await professions.forEach(e=>{
  //     if(department.indexOf(e.Department)!==-1)return ;
  //     department.push(e.Department)
  // })
  res.json(professions);
})
router.post("/zone", async (req, res) => {
  let dependency = [];
  await Object.keys(req.body).forEach(
    key => {
      dependency.push(`${req.body[key]}`);
    }
  );
  let zip = await ProfileOptions.findOne({ _id: mongoose.Types.ObjectId(req.body.country) })
  ProfileOptions.find({ dependency: mongoose.Types.ObjectId(dependency[0]) }).then(async data => {
    data = await data.filter(info => {
      out = true;
      for (let i = 0; i < dependency.length; i++) {
        out = out && (info.dependency.indexOf(dependency[i]) !== -1);
      }
      return out;
    });
    res.json({ status: "success", data: data, length: data.length, zip: zip });
  }).catch(err => {
    res.json({ status: "error", message: err.message })
  });
})
router.post("/children", (req, res) => {
  if (req.body.relationship === "621f0e26d69e48efe893d35f")
    res.json({ status: "success", data: [], children: req.body.relationship });
  else
    res.json({ status: "success", data: [{ _id: 0, label: 0, name: 'children' }, { _id: 1, label: 1 }, { _id: 2, label: 2 }, { _id: 3, label: 3 }, { _id: 4, label: 4 }, { _id: 5, label: 5 }, { _id: 6, label: 6 }, { _id: 7, label: 7 }, { _id: 8, label: 8 }, { _id: 9, label: 9 }] });
})
router.route("/:component")
  .get(async (req, res) => {
    try {
      opts = Array.from(await ProfileOptions.find({ name: req.params.component }));
      console.log(opts);
      await opts.map(e => {
        str = JSON.stringify(e);
        str = str.replaceAll("###country###", req.session.user.country);
        str = str.replaceAll("###state###", req.session.user.state);
        str = str.replaceAll("###city###", req.session.user.city);

        return JSON.parse(str);
      })
      res.json({ status: "success", data: opts, component: req.params.component })
    }
    catch (err) {
      res.json({ status: "error", message: err.message })
    }
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