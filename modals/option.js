const schema=require("mongoose").Schema;
module.exports=new schema( {
    api: String,
    method: String,
    depends: [String]
});