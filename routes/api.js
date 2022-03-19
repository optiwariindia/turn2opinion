const router = require("express").Router();
const mongoose = require("mongoose");
const Survey = mongoose.model("survey", require("../modals/survey"));
const ProfileOptions = mongoose.model("profileOptions", require("../modals/profileOptions"));

router.get("/addData",async (req, res) => {
    // const profileAns = JSON.parse(require("fs").readFileSync("./databank/profileAnswers.json"));
    let survey= await new Survey({
        "uri": "basic",
        "name": "Basic Profile Survey",
        "icon": "basic-profile.png",
        "pages": [
          [
          ],
          [
          {
            "name": "fn",
            "label": [
              {
                "lang": "en",
                "value": "First Name",
              },
              {
                "lang": "fr",
                "value": "Prénom",
              }
            ],
            "type": "text",
            "required": true,
            "editable": false,
            "class": "col-sm-6",
          },
          {
            "name": "ln",
            "label": [
              {
                "lang": "en",
                "value": "Last Name",
              },
              {
                "lang": "fr",
                "value": "Nom",
              }
            ],
            "type": "text",
            "required": true,
            "editable": false,
            "class": "col-sm-6",
          },
          {
            "name": "email",
            "label": [
              {
                "lang": "en",
                "value": "Email",
              },
              {
                "lang": "fr",
                "value": "Email",
              }
            ],
            "type": "email",
            "required": true,
            "editable": false,
            "class": "col-sm-6",
          },
          {
            "name": "workemail",
            "label": [
              {
                "lang": "en",
                "value": "Work Email",
              },
              {
                "lang": "fr",
                "value": "Email professionnel",
              }
            ],
            "type": "email",
            "required": false,
            "editable": true,
            "class": "col-sm-6",
          },
          {
            "name": "phone",
            "label": [
              {
                "lang": "en",
                "value": "Phone",
              },
              {
                "lang": "fr",
                "value": "Téléphone",
              }
            ],
            "type": "tel",
            "required": true,
            "editable": false,
            "class": "col-sm-6",
          },
          {
            "name": "phone1",
            "label": [
              {
                "lang": "en",
                "value": "Alternate Number",
              },
              {
                "lang": "fr",
                "value": "Téléphone alternatif",
              }
            ],
            "type": "tel",
            "required": false,
            "editable": true,
            "class": "col-sm-6",
          },
          {
            "name": "dob",
            "label": [
              {
                "lang": "en",
                "value": "Date of Birth",
              },
              {
                "lang": "fr",
                "value": "Date de naissance",
              }
            ],
            "type": "date",
            "required": true,
            "editable": false,
            "class": "col-sm-6",
          },
          {
            "name": "age",
            "label": [
              {
                "lang": "en",
                "value": "Age",
              },
              {
                "lang": "fr",
                "value": "Age",
              }
            ],
            "type": "text",
            "required": false,
            "editable": false,
            "options": {
              "api": "/api/v1/age",
              "method": "POST",
              "depends": [
                "dob"
              ],
            },
            "class": "col-sm-6",
          }],[
          {
            "name": "country",
            "label": [
              {
                "lang": "en",
                "value": "Country",
              },
              {
                "lang": "fr",
                "value": "Pays",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/country",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-6",
          },
          {
            "name": "zone",
            "label": [
              {
                "lang": "en",
                "value": "Zone",
              },
              {
                "lang": "fr",
                "value": "",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/zone",
              "method": "POST",
              "depends": [
                "country"
              ],
            },
            "class": "col-sm-6",
          },
          {
            "name": "state",
            "label": [
              {
                "lang": "en",
                "value": "State",
              },
              {
                "lang": "fr",
                "value": "Ville",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/state",
              "method": "POST",
              "depends": [
                "zone"
              ],
            },
            "class": "col-sm-6",
          },
          {
            "name": "city",
            "label": [
              {
                "lang": "en",
                "value": "City",
              },
              {
                "lang": "fr",
                "value": "Ville",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/city",
              "method": "POST",
              "depends": [
                "state"
              ],
            },
            "class": "col-sm-6",
          },
          {
            "name": "zipcode",
            "label": [
              {
                "lang": "en",
                "value": "Zip Code",
              },
              {
                "lang": "fr",
                "value": "Code postal",
              }
            ],
            "type": "text",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/zipcode",
              "method": "POST",
              "depends": [
                "country"
              ],
            },
            "class": "col-sm-6",
          },
          {
            "name": "ethnicity",
            "label": [
              {
                "lang": "en",
                "value": "Please Select your ethnicity",
              },
              {
                "lang": "fr",
                "value": "Sélectionnez votre ethnicité",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/ethnicity",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-6",
          },
          {
            "name": "origin",
            "label": [
              {
                "lang": "en",
                "value": "Are you of Hispanic, Latino, or Spanish origin?",
              },
              {
                "lang": "fr",
                "value": "Êtes-vous de l'origine hispanique, latino ou espagnole?",
              }
            ],
            "type": "select",
            "required": true,
            "editable": false,
            "options": {
              "api": "/api/v1/origin",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-6",
          }],[
          {
            "name": "education",
            "label": [
              {
                "lang": "en",
                "value": "What is the highest level of education you have completed?",
              },
              {
                "lang": "fr",
                "value": "Quel est le plus haut niveau d'éducation que vous avez terminé?",
              }
            ],
            "type": "select",
            "required": true,
            "editable": true,
            "options": {
              "api": "/api/v1/education",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-6",
          },
          {
            "name": "relationship",
            "label": [
              {
                "lang": "en",
                "value": "What is your relationship status?",
              },
              {
                "lang": "fr",
                "value": "Quel est votre statut de relation?",
              }
            ],
            "type": "select",
            "required": true,
            "editable": true,
            "options": {
              "api": "/api/v1/relationship",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-6",
          },
          {
            "name": "children",
            "label": [
              {
                "lang": "en",
                "value": "How many children do you have?",
              },
              {
                "lang": "fr",
                "value": "Combien de enfants avez-vous?",
              }
            ],
            "type": "select",
            "required": true,
            "editable": true,
            "options": {
              "api": "/api/v1/children",
              "method": "GET",
              "depends": [
                "relationship"
              ],
            },
            "class": "col-sm-6",
          }],[
          {
            "name": "interests",
            "label": [
              {
                "lang": "en",
                "value": "Please choose your hobbies and interests",
              },
              {
                "lang": "fr",
                "value": "Sélectionnez vos loisirs et intérêts",
              }
            ],
            "type": "checkbox",
            "required": true,
            "editable": true,
            "options": {
              "api": "/api/v1/interests",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-12",
          }],[
          {
            "name": "surveycategory",
            "label": [
              {
                "lang": "en",
                "value": "Please choose the categories you would be interested to get the participation in future surveys",
              },
              {
                "lang": "fr",
                "value": "Sélectionnez les catégories que vous seriez intéressé à participer aux sondages futures",
              }
            ],
            "type": "checkbox",
            "required": true,
            "editable": true,
            "options": {
              "api": "/api/v1/surveycategory",
              "method": "GET",
              "depends": [],
            },
            "class": "col-sm-12",
          }]
        ]
      })
      survey.save()
      
    res.json(survey);
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
    let dependency = [];
        await Object.keys(req.body).forEach(
            key => {
                dependency.push(`${req.body[key]}`);
            }
        );
        let zip=await ProfileOptions.findOne({_id:mongoose.Types.ObjectId(req.body.country)})
        ProfileOptions.find({dependency:mongoose.Types.ObjectId(dependency[0])}).then( async data => {
            data = await data.filter(info => {
                out = true;
                for (let i = 0; i < dependency.length; i++) {
                    out = out && (info.dependency.indexOf(dependency[i]) !== -1);
                }
                return out;
            });
            res.json({ status: "success", data: data, length: data.length,zip:zip });
        }).catch(err => {
            res.json({ status: "error", message: err.message })
        });
})
router.post("/children",(req,res)=>{
  if(req.body.relationship==="621f0e26d69e48efe893d35f")
  res.json({status:"success",data:[],children:req.body.relationship});
  else
  res.json({status:"success",data:[{_id:0,label:0,name:'children'},{_id:1,label:1},{_id:2,label:2},{_id:3,label:3},{_id:4,label:4},{_id:5,label:5},{_id:6,label:6},{_id:7,label:7},{_id:8,label:8},{_id:9,label:9}]});
})
router.route("/:component")
    .get(async (req, res) => {
      try{
        opts=Array.from(await ProfileOptions.find({ name: req.params.component }));
          console.log(opts);
          await opts.map(e=>{
            str=JSON.stringify(e);
            str=str.replaceAll("###country###",req.session.user.country);
            str=str.replaceAll("###state###",req.session.user.state);
            str=str.replaceAll("###city###",req.session.user.city);
            
            return JSON.parse(str);
          })
            res.json({ status: "success", data: opts,component:req.params.component })
        }
        catch(err){
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