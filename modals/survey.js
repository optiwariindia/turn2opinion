const schema = require("mongoose").Schema;
const question=require("./question");
module.exports = new schema(
    {
        uri: {
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
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        summary:String,
        category:String,
        source:String,
        surveyID:String,
        surveyPoints:Number,
        availableFor:[String],
        thankyou:String,
        completed:[String],
        profiles:[String],
        info:String,
        description:String,
        active:{
            from:Date,
            to:Date
        },
        pages: [[question ]]
    }
)