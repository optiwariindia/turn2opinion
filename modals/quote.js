const Schema=require('mongoose').Schema;
module.exports=new Schema({
    name:String,
    email:String,
    company:String,
    message:String
},{
    timestamps:true,
    collection:'quote',
    versionKey:false
});