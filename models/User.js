const mongoose =  require('mongoose')


const userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    relation: {
        type: String
    },
    topics_of_interest: [{
        type: String
    }],
    disability_tags: [{
        type: String
    }],
    // liked_posts: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // }],
    // liked_comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    date: {
        type: Date,
        default: Date.now
    },
    zip:{
        type: String, //stored as string to keep as 5 digits if begin with zero
    },
    county: {
        type: String
    },
    about_me:
    {
        type:String,
        default: ""
    }
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User