const router = require('express').Router()
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')


router.post('/register', async (req, res) =>{
    try {

        const findUser = await User.findOne({
            email: req.body.email
        })

        if(findUser) return res.json({error: 'Email Already exists'})
        
        const findUserName = await User.findOne({
            username: req.body.username,
        })

        if(findUserName) return res.json({ error: 'Choose a different username'})

        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            zip: req.body.zip,
            county: req.body.county
        })
        await newUser.save()
        
        // res.json({newUser})

        const payload = {
            email: newUser.email,
            username: newUser.username,
            zip: newUser.zip,
            county: newUser.county,
            id: newUser.id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 60 * 60 })
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on register route' })
    }
})

router.post('/login', async (req, res) =>{
    try {
        const foundUser = await User.findOne({
            username: req.body.username
        })

        const noLoginMessage = 'Incorrect username or password'
        
        if(!foundUser) return res.status(400).json({msg: noLoginMessage})

        const matchPassword = await bcrypt.compare(req.body.password, foundUser.password)
        
        if(!matchPassword) return res.status(400).json({ msg: noLoginMessage})

        const payload = {
            username: foundUser.username,
            email: foundUser.email,
            id: foundUser.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({token})

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on login route' })
    }

})



router.get('/auth-locked/news-feed', authLockedRoute, async (req,res) => {
        
})

router.get('/profile', authLockedRoute, async (req, res) =>{

    const userInfo = await User.findOne({
        id: res.locals.user.id
    })

    res.json( { about_me: userInfo.about_me } )
})

router.get('/:userId', authLockedRoute, async(req,res) => {
    const userId = req.params.userId
    const userFind = User.findById(userId)
    if(userFind){
        res.json()
    }
})

router.put('profile')


module.exports = router