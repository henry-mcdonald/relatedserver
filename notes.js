
const mongoose = require('mongoose')
//Subdocument Schema
const commentSchema = new mongoose.Schema({
    content: String,
    rating: Number
})
// Step 1 - Define the Schema!
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [commentSchema] //Embedded subdocument one to many relationship
})
// Step 2 - Generate the Model!
const Post = mongoose.model('Post', postSchema)
const Comment = mongoose.model('Comment', commentSchema)
// Step 3 - Export it!
module.exports = {
    Post,
    Comment
}
