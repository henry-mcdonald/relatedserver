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
        // }).populate({
        //     path: "comments",
        //     select: "content"
        // }).populate({
        //     path: "users_who_liked",
        //     select: "username"
        // }).populate({
        //     path: "comments",
        //     populate: {
        //         path: 'user',
        //         select: 'username'
        //     }
        // }).populate({
        //     path: "comments",
        //     populate: {
        //         path: 'users_who_liked',
        //         select: 'username'
        //     }
        // }).populate({
        //     path: 'comments',
        //     populate: {
        //         path: 'replies',
        //         populate: {
        //                 path: 'user',
        //                 select:'username'
        //             }
        //         }
        //     }).populate({
        //         path: 'comments',
        //         populate: {
        //             path: 'replies',
        //             populate: {
        //                     path: 'users_who_liked',
        //                     select:'username'
        //                 }
        //             }
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
            user: user.id,
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
        const findPost = await Post.findById(
            {_id: req.params.postId}, {new: true}
            ).populate({
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
        res.json( {findPost: findPost} )

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "adding a comment failed"} ) 
    }

})

//like a post 
router.post('/:postId/like-the-post', authLockedRoute, async (req, res) =>{
    try {
        const userId = res.locals.user.id
        const findPost = await Post.findById(req.params.postId)
    
        if(findPost.users_who_liked.includes(userId) === true){
            console.log("Its true, it has it.")
            findPost.users_who_liked.pull({ _id: userId })
            await findPost.save()
          
        }else{
            console.log("it does not have it")
            findPost.users_who_liked.push(userId)
            await findPost.save()
        }
        res.json({findPost: findPost})

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "adding a comment failed"} )
    }
})

//Edit a Post
router.put('/:postId/edit-post', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findPost = await Post.findById({
            _id:req.params.postId
        })
        const postAuthorId = findPost.user._id.toString()
        
        if(userId === postAuthorId){
            console.log("its matched")
            const updatePost = await Post.findByIdAndUpdate(
                    {_id: req.params.postId},
                    {$set: {content: req.body.content}},
                    {new: true})
                res.json(updatePost)
        }else{
            console.log("its not matched")
            res.json({error: "YOU AIN'T ALLOWED TO CHANGE OTHER PEEPS POSTS!"})
        }
        console.log(userId, "this is the userId")
        console.log(postAuthorId, "this is the AuthorId")
           
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "cannot edit post. Error occured"})
    }
})

//Delete a post
router.delete('/:postId/delete-post', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findPost = await Post.findById(req.params.postId)
        const postAuthorId = findPost.user._id.toString()

        if(postAuthorId === userId){
            const deletePost = await Post.findByIdAndDelete({
                _id: req.params.postId
            })
            res.json(deletePost)
        }else{
            res.json({msg: "You cannot delete someone else's post!"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "cannot delete Post.  Error occured."})
    }
})



module.exports = router