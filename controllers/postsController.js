const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const Reply = require('../models/Reply.js')
const authLockedRoute = require('./authLockedRoute')


//Get all posts
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
            path: "users_who_liked",
            select: "username"
        }).populate({
            path: "comments",
            populate: {
                path: 'user',
                select: 'username'
            }
        }).populate({
            path: "comments",
            populate: {
                path: 'users_who_liked',
                select: 'username'
            }
        }).populate({
            path: 'comments',
            populate: {
                path: 'replies',
                populate: {
                        path: 'user',
                        select:'username'
                    }
                }
            }).populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                    populate: {
                            path: 'users_who_liked',
                            select:'username'
                        }
                    }
                })

        // console.log(typeof findPosts)
        res.json({ findPosts: findPosts  })

        
    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Finding all posts failed"} )
    }
    
})

//View a single post

router.get('/:postId', authLockedRoute, async (req, res) => {
    try {
        const findPost = await Post.findById(req.params.postId).populate({
            path: 'user', 
            select: 'username'
        }).populate({
            path: "comments",
            select: "content"
        }).populate({
            path: "users_who_liked",
            select: "username"
        }).populate({
            path: "comments",
            populate: {
                path: 'user',
                select: 'username'
            }
        }).populate({
            path: "comments",
            populate: {
                path: 'users_who_liked',
                select: 'username'
            }
        }).populate({
            path: 'comments',
            populate: {
                path: 'replies',
                populate: {
                        path: 'user',
                        select:'username'
                    }
                }
            }).populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                    populate: {
                            path: 'users_who_liked',
                            select:'username'
                        }
                    }
                })
            
            console.log(findPost)
            res.json({ findPost: findPost })
        
    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Finding the single post failed"} )
    }
})

//Add a new post
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
            comments:[],
        })
        
        console.log(createPost)

        res.json({ createPost: createPost })

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Posting a Post failed"} )  
    }
    
}) 

// Add a comment to post
router.post('/:postId/add-comment', authLockedRoute, async (req, res) =>{
    try {
        const userId = res.locals.user.id
        const comment = await new Comment ({
            content: req.body.content,
            user: userId
        })
        comment.save()
        const findPost = await Post.findById(req.params.postId).populate({
            path: "comments",
            select: "content"
        }).populate({
            path:"comments",
                populate: {
                    path: "user",
                    select: "username"
                }
        })
        findPost.comments.push(comment)
        await findPost.save()

        console.log(findPost)
        res.json({ findPost: findPost} )

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "adding a comment failed"} ) 
    }

})

//like a post 
router.post('/:postId/like-the-post', authLockedRoute, async (req, res) =>{
    try {

        const userId = res.locals.user.id
        const findPost = await Post.findById(req.params.postId).populate({
            path: "users_who_liked",
            select: "username"
        })
        findPost.users_who_liked.push(userId)
        await findPost.save()

        console.log(findPost)

        res.json({findPost: findPost})

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "adding a comment failed"} )
    }
})

module.exports = router