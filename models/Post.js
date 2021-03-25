const mongoose =  require('mongoose')


const postSchema = new mongoose.Schema({
    discussion_tags: [{
        type: String
    }],
    title: {
        type: String
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

postSchema.index({content: 'text'}, {title: 'text'})

const Post = mongoose.model('Post', postSchema)


module.exports = Post