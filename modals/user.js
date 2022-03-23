const mongoose = require("mongoose");
const schema = mongoose.Schema;
const autoIncrement=require("mongoose-sequence")(mongoose);
const Country = require("./country");
user = new schema({
    fn: {
        type: String,
        required: true,
    },
    ln: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    phone: {
        type: String,
        required: false,
        // unique: true,
        lowercase: true,
    },
    gender: {
        type: String,
        required: true
    },
    cn: String,
    cntry: Country,
    lat: Number,
    lng: Number,
    timezone: String,
    propic: {
        type: String,
        required: false
    },
    verified: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        }
    },
    created: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
        default: null
    },
    terms: [],
    timezone: { type: String, required: false, default: null },
    security: {
        question: String,
        answer: String
    },
    workemail: {
        type: String,
        required: false,
    },
    phone1: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    zipcode: String,
    ethnicity: {
        type: String,
        required: false
    },

    origin: {
        type: String,
        required: false
    },
    education: {
        type: String,
        required: false
    },
    relationship: {
        type: String,
        required: false
    },
    children: {
        type: String,
        required: false

    },
    empstat: {
        type: String,
        required: false
    },
    ed_further_study: { type: String },
    ed_industry: { type: String },
    ed_international: { type: String },
    ed_job_seeker: { type: String },
    ed_level: { type: String },
    ed_postplans: { type: String },
    ed_school_year: { type: String },
    ed_status: { type: String },
    ed_university: { type: String },
    ed_university_degree: { type: String },
    education: { type: String },
    experience: { type: String },
    function: { type: String },
    industry: { type: String },
    interest: [String],
    jobrole: { type: String },
    mil_branch: { type: String },
    mil_branch_1: { type: String },
    mil_branch_rank: { type: String },
    mil_branch_rank1: { type: String },
    mil_combatzone: { type: String },
    mil_family_branch: { type: String },
    mil_family_sponsoring: { type: String },
    mil_family_sponsoring_name: { type: String },
    mil_final_rank: { type: String },
    mil_outside: { type: String },
    mil_rank: { type: String },
    mil_yesno: { type: String },
    orgage: { type: String },
    orgdecision: { type: String },
    orglinkedin: { type: String },
    orglocation: { type: String },
    orgoverseas: { type: String },
    orgrevenue: { type: String },
    orgrevenuestream: { type: String },
    orgsize: { type: String },
    orgspend: { type: String },
    orgwebsite: { type: String },
    origin: { type: String },
    state: { type: String },
    surveycategories: [String],
    zone: { type: String },
    Homeowner1: String,
    Homeowner10: String,
    Homeowner11: String,
    Homeowner12: String,
    Homeowner13: String,
    Homeowner14: String,
    Homeowner16: String,
    Homeowner18: String,
    Homeowner19: String,
    Homeowner2: String,
    Homeowner20: String,
    Homeowner21: String,
    Homeowner22: String,
    Homeowner23: String,
    Homeowner24: String,
    Homeowner25: String,
    Homeowner26: String,
    Homeowner27: String,
    Homeowner28: String,
    Homeowner29: String,
    Homeowner3: String,
    Homeowner30: String,
    Homeowner31: String,
    Homeowner4: String,
    Homeowner5: String,
    Homeowner6: String,
    Homeowner7: String,
    Homeowner8: String,
    Homeowner9: String,
    Mobile1: String,
    Mobile10: String,
    Mobile11: String,
    Mobile12: String,
    Mobile13: String,
    Mobile14: String,
    Mobile15: String,
    Mobile16: String,
    Mobile17: String,
    Mobile18: String,
    Mobile19: String,
    Mobile2: String,
    Mobile20: String,
    Mobile21: String,
    Mobile3: String,
    Mobile4: String,
    Mobile5: String,
    Mobile6: String,
    Mobile7: String,
    Mobile8: String,
    Mobile9: String,
    children: String,
    city: String,
    country: String,
    ed_aadegree: String,
    ed_bdegree: String,
    ed_cur_format: String,
    ed_cur_stream: String,
    ed_degree: String,
    ed_degree_institute: String,
    ed_degree_stream: String,
    ed_institution: String,
    ed_mdegree: String,
    ed_online: String,
    ed_onlineclass: String,
    ed_phd: String,
    ed_prof_degree: String,
    ed_stream: String,
    ed_upgrade_plan: String,
    fin_banking_service: String,
    fin_creditcard_count: String,
    fin_creditcard_type: String,
    fin_creditcard_usage: String,
    fin_household_income: String,
    fin_investment: String,
    fin_investment_type: String,
    fin_investment_type_current: String,
    fin_investment_type_planned: String,
    fin_mortgage_type: String,
    fin_personal_income: String,
    fin_products_insurance: String,
    fin_products_using: String,
    fin_property: String,
    fin_rasidence_type: String,
    fin_tax_return: String,
    food1: String,
    food10: String,
    food11: String,
    food12: String,
    food13: String,
    food14: String,
    food15: String,
    food16: String,
    food17: String,
    food18: String,
    food19: String,
    food2: String,
    food20: String,
    food21: String,
    food22: String,
    food23: String,
    food3: String,
    food4: String,
    food5: String,
    food6: String,
    food7: String,
    food8: String,
    food9: String,
    function: String,
    gaming1: String,
    gaming10: String,
    gaming11: String,
    gaming12: String,
    gaming13: String,
    gaming14: String,
    gaming15: String,
    gaming16: String,
    gaming17: String,
    gaming18: String,
    gaming19: String,
    gaming2: String,
    gaming20: String,
    gaming21: String,
    gaming22: String,
    gaming23: String,
    gaming24: String,
    gaming25: String,
    gaming26: String,
    gaming27: String,
    gaming3: String,
    gaming4: String,
    gaming5: String,
    gaming6: String,
    gaming7: String,
    gaming8: String,
    gaming9: String,
    lifestyle1: String,
    lifestyle10: String,
    lifestyle11: String,
    lifestyle2: String,
    lifestyle3: String,
    lifestyle4: String,
    lifestyle5: String,
    lifestyle6: String,
    lifestyle7: String,
    lifestyle8: String,
    lifestyle9: String,
    orgage: String,
    orgdecision: String,
    orgoverseas: String,
    orgrevenuestream: String,
    orgsize: String,
    orgspend: String,
    origin: String,
    parenting1: String,
    parenting2: String,
    parenting3: String,
    parenting4: String,
    parenting5: String,
    parenting6: String,
    parenting7: String,
    parenting8: String,
    pet1: String,
    pet10: String,
    pet11: String,
    pet12: String,
    pet13: String,
    pet14: String,
    pet15: String,
    pet16: String,
    pet17: String,
    pet18: String,
    pet19: String,
    pet2: String,
    pet20: String,
    pet21: String,
    pet22: String,
    pet23: String,
    pet25: String,
    pet27: String,
    pet28: String,
    pet29: String,
    pet3: String,
    pet30: String,
    pet4: String,
    pet5: String,
    pet6: String,
    pet7: String,
    pet8: String,
    relationship: String,
    state: String,
    tech_computer: String,
    tech_computer_brands: String,
    tech_computer_browser: String,
    tech_computer_os: String,
    tech_computer_primary: String,
    tech_computer_purchase_brand: String,
    tech_computer_share: String,
    tech_connection_type: String,
    tech_internet_location: String,
    tech_internet_recentActivity: String,
    tech_mac_count: String,
    tech_mac_type: String,
    tech_office_suite: String,
    tech_pc_count: String,
    deletedOn:{
        type: Date,
        required: false,
        default:null
    },
    points:{type:Number,default:200},
    frid:{
        prefix:"TP1",
        numvalue:{type:Number,default:1}
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    
});
user.virtual("age").get(function () {
    let today = new Date();
    let birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear() + " Years";
    return age;
});
user.virtual("name")
    .get(function () {
        return this.fn + " " + this.ln;
    });
module.exports = user;