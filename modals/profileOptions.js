const schema=require("mongoose").Schema;
module.exports=new schema({
    name:String,
    dependency:[],
    label:String
});