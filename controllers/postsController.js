const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const Reply = require('../models/Reply.js')
const authLockedRoute = require('./authLockedRoute')



router.get('/', authLockedRoute, async (req, res) =>{
    let postData = {}
    let user = null
    let usersname = null
    let usersLiked = null
    try {

        const findPosts = await Post.find().populate({
            path: 'user', 
            select: 'username'
            }).populate({
                path: "comments",
                select: "content"
                }).populate({
                    path: "comments",
                        populate: {
                            path: 'user',
                            select: 'username'
                        }
                }).populate({
                    path: 'comments',
                        populate: {
                            path: 'replies',
                            select: ['content','user']
                        }
                })


        res.json({ findPosts: findPosts  })

        
    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Finding all posts failed"} )
    }
    
})

router.post('/', authLockedRoute, async (req, res) =>{
    try {

        let topics = ["Wheelchair Accessability", "Community Events",
        "Local Meetups", "Awareness"]

        const user = res.locals.user

        const createPost  = await Post.create({
            content: req.body.content,
            user_id: user.id,
            discussion_tags: [],
            users_who_liked: [],

        })
        
        console.log(createPost)

        res.json({ createPost: createPost })

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Posting a Post failed"} )  
    }

    
}) 





module.exports = router