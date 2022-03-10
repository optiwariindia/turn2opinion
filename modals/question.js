const schema = require("mongoose").Schema;
const questionLabel=require("./questionLabel");
const option=require("./option");
module.exports = new schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[a-z0-9-]+$/.test(v);
            },
            message: "{VALUE} must have a-z, 0-9 and - only."
        }
    },
    label: [
        questionLabel
    ],
    type: String,
    required: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: true
    },
    options:option,
    class: {
        type: String,
        required: true,
        default: "col-sm-12"
    },
    title:String,
    message:String,
    for:Object
});