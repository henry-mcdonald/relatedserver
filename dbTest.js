//seed DB with sampler data 
const bcrypt = require('bcryptjs')
const faker = require('faker')
require('./models')

const User = require('./models/User')
const Post = require('./models/Post')
const Comment = require('./models/Comment')
const Reply = require('./models/Reply')

async function generateBigJSON(){
    const json_object = await Post.findOne({})
    .populate({
        path: 'user'
    })
    console.log(json_object)
}

generateBigJSON()

// Users.findOne({/* query here */})
// .populate({
//   path: 'address friends', // The string we passed in before
//   populate: {
//     path: 'address' // This will populate the friends' addresses
//   }
// });