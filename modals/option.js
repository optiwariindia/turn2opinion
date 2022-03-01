const schema=require("mongoose").Schema;
module.exports=new schema( {
    endpoint: String,
    method: String,
    params: [String]
});