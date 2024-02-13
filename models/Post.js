const mongoose = require("mongoose")



const postSchema = new mongoose.Schema({

    userId: {
        type: String,
    },
    desc: {
        type: String,
        max: 50
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: []
    },

})
module.exports = mongoose.model('Post', postSchema);
