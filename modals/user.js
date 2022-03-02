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

    }
});

user.virtual("name")
    .get(function () {
        return this.fn + " " + this.ln;
    });
module.exports = user;