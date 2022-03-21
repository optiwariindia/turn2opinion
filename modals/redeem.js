const schema = require("mongoose").Schema;
const ObjectId=require("mongoose").Types.ObjectId;
module.exports = new schema(
    {
        respondent: ObjectId,
        paymentMethod:{
            paypal:{
                type:String,
                required:false
            },
            upi:{
                type:String,
                required:false
            },
            bank:{
                ifsc:String,
                account:String,
                name:String
            }
        },
        amount:String,
        points:Number,
        redeemDate:{
            type:Date,
            required:false,
            default:null
        }
    },{
        timestamps:true,
        collection:"redeem"
    });