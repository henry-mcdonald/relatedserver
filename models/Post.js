const mongoose =  require('mongoose')


const postSchema = new mongoose.Schema({
    discussion_tags: {
        type: Array
    },
    content: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users_who_liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],

},{
    timestamps: true
})



const Post = mongoose.model('Post', postSchema)


module.exports = Post