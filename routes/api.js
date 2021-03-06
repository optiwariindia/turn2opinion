const router = require("express").Router();
const { randomInt } = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("users", require("../modals/user"));
const Survey = mongoose.model("survey", require("../modals/survey"));
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));
const Redeem = mongoose.model("redeem", require("../modals/redeem"));
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Profiles = mongoose.model("profiles", require("../modals/profiles"));

router.get("/survey/:surveyname",async (req,res)=>{
  survey=await Survey.find({uri:req.params.surveyname});
  res.json(survey);
})
router.get("/survey/:surveyname/qlist",async (req,res)=>{
  survey=await Survey.find({uri:req.params.surveyname});
  qlist=[];
  for(i=0;i<survey[0].pages.length;i++){
    page=survey[0].pages[i];
    for(j=0;j<page.length;j++){
      qlist.push(`${page[j].name}||${page[j].type}||${page[j].label[0]}`);
    }
  }
  res.json(qlist);
})
router.get("/profileoptions",async (req,res)=>{
  data=await ProfileOptions.find({name:{$in:["empstat","industry","function","jobrole","workemail","orgsize","orglocation","orglinkedin","orgwebsite","orgoverseas","orgdecision","orgspend","experience","orgrevenue","orgage","orgrevenuestream","mil1","mil2","mil3","mil4","mil5","mil6","mil7","mil8","mil9","mil10","mil11","mil12","mil13","mil14","mil15","mil16","mil17","mil18","mil19","mil20","mil21","mil22","mil23","mil24","mil25","mil26","mil27","ed_status","ed_level","ed_school_year","ed_university","ed_university_degree","ed_further_study","ed_international","ed_postplans","ed_job_seeker","ed_industry"]}})
  res.render("tabout.twig",{info:data});
})
router.get("/exrate/:cur1/:cur2",(req,res)=>{
  exrate=JSON.parse(require("fs").readFileSync("./databank/exrate.json"));
  res.json({rate:(exrate.rates[req.params.cur2]/exrate.rates[req.params.cur1])});
})
router.get("/getCurrency",(req,res)=>{
  currencies=JSON.parse(require("fs").readFileSync("./databank/theworld.json"));
  res.json(currencies[req.session.user.cn.toUpperCase()].currency);
})
router.get("/userinfo", (req, res) => {
  res.json(req.session.user);
})
router.get("/earnings", async (req, res) => {
  redeem = await Redeem.aggregate([
    {$match:{respondent:req.session.user._id}},
    { $project: { "did": { $dayOfYear: "$redeemDate" }, "month": { $month: "$redeemDate" }, "year": { $year: "$redeemDate" }, "amount": 1, "status": 1 } },
    { $group: { _id: { year: "$year", month: "$month", did: "$did" }, total: { $push: "$amount" }, status: { $first: "$status" } } }
  ]);
  $info = new Set();//[];
  min = null;
  max = 0;
  await redeem.forEach(async e => {
    amount = await e.total.reduce((a, b) => a + Number(b.toString().replace(/[^\d.-]/g, '')), 0);
    min = (min == null || e._id.year * 100 + e._id.month < min) ? e._id.year * 100 + e._id.month : min;
    max = (max < e._id.year * 100 + e._id.month) ? e._id.year * 100 + e._id.month : max;
    $info[`${e._id.year * 100 + e._id.month}`] = amount;
  });
  data = {
    month: [],
    amount: [],
    total:0
  }
  for (i = min; i <= max; i++) {
    if(i==null)continue;
    data.month.push(monthNames[i % 100 - 1] + " " + Math.floor(i / 100));
    data.amount.push($info[`${i}`] || 0);
  }
  data.total=await data.amount.reduce(e=>e+Number(e.toString().replace(/[^\d.-]/g, '')),0);
  res.json(data);
})
router.get("/addData", async (req, res) => {
  res.json({});
});
router.get("/profileStatus", async (req, res) => {
  if (req.session.user === undefined) {
    res.json({
      status: "error",
      message: "You are not logged in"
    });
    return;
  }
  res.json(req.session.user.profileCategories);
  return;
})
router.route("/professions")
  .get((req, res) => {
    professions = require("fs").readFileSync("./databank/professions.json");
    res.json(JSON.parse(professions))
  });
router.get("/professions/industry", async (req, res) => {
  professions = JSON.parse(require("fs").readFileSync("./databank/professions.json"));
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
router.post("/save/:field", async (req, res) => {
  // updating user info
  // req.session.user[req.params.field]=req.body[req.params.field];
  user = await User.findOneAndUpdate({ _id: req.session.user._id }, { $set: { [req.params.field]: req.body[req.params.field] } }, { new: true })
  options = [];
  if (mongoose.isValidObjectId(user[req.params.field]))
    options = await ProfileOptions.find({ dependency: mongoose.Types.ObjectId(user[req.params.field]) });
  req.session.user = user;
  res.json({ options: options });
})
router.post("/zipcode", async (req, res) => {
  countries = JSON.parse(require("fs").readFileSync("./databank/theworld.json"))
  options = await ProfileOptions.find({ name: 'country', label: countries[req.body.cn].name });

  res.json({ options: options[0] });
})
router.get("/country", (req, res) => {
  countries = JSON.parse(require("fs").readFileSync("./databank/theworld.json"))
  if ("cn" in req.session.user)
  res.json(countries[req.session.user.cn.toUpperCase()]);
  else
  res.json(countries);
})
router.route("/automobile/:type").get((req,res)=>{
  let data = JSON.parse(require("fs").readFileSync("./databank/automobile.json"));
  if(req.params.type in data)
  {
    info=data[req.params.type];
    for (let i = 0; i < info.seq.length; i++) {
      const seq = info.seq[i];
      temp=info.options[seq].sort();
      info.options[seq]=Array.from(new Set(temp));      
    }
  res.json(info);
  }
  else
  res.json({
    status:"error",
    error:"No record found"
  });
})
router.route("/:component")
  .get(async (req, res) => {
    try {
      opts = Array.from(await ProfileOptions.find({ name: req.params.component }));
      
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
        console.log(key);
        if(mongoose.isValidObjectId(req.body[key]))
        dependency.push(`${req.body[key]}`);
        try{
          dependency=JSON.parse(req.body[key]);
          
        }catch(err){
          console.log(err);
        }
      }
    );
    console.log(dependency);
    ProfileOptions.find({ name: req.params.component }).then(data => {
      data = data.filter(info => {
        out = false;
        console.log(dependency);
        for (let i = 0; i < dependency.length; i++) {
          out = out || (info.dependency.indexOf(dependency[i]) !== -1);
          console.log({
            out: out,
            dependency:info.dependency,
            deparray:dependency[i],
            data:info
          });
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