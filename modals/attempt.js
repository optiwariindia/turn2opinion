const schema = require("mongoose").Schema;
const ObjectId=require("mongoose").Types.ObjectId;
module.exports = new schema(
    {
        respondent: ObjectId,
        survey: ObjectId,
        rewards:Number,
        source:String,
        category:String,
        attemp:{
            from:String,
            device:String,
            start:Date,
            end:Date,
        },
        status:{
            type:String,
            enum:["drafted","pending","inactive","under review","disqualified","overquota","closed","completed"],
        },
        reason:String,
    },{
        timestamps:true
    }
);