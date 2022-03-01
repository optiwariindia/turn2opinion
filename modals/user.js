const schema = require("mongoose").Schema;
const Country = require("./country");
module.exports =  new schema({
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
    timezone:{type:String,required:false,default:null},
    security:{
        question:String,
        answer:String
    }
});