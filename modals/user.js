const schema = require("mongoose").Schema;
const { default: mongoose } = require("mongoose");
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
        surveycategories:[String],
        zone: { type: String }
    },{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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