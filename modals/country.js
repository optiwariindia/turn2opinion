const schema = require("mongoose").Schema;
module.exports = new schema({
    name: String,
    accessCodes: Array,
    dialCode: String,
    iso2: String,
    priority: Number,
});
