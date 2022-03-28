const schema = require("mongoose").Schema;
module.exports = new schema({
    Que: String,
    Ans: String,
    seqno: Number
},{
    timestamps: true,
    collection:"faq"
});
