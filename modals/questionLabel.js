const schema = require("mongoose").Schema;
module.exports = new schema({
    lang: {
        type: String,
        required: true,
        lowercase: true,
    },
    value: {
        type: String,
    }
});