const db = require('../dbconfig')
const {isEmail,isEmpty} =  require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const handleErrors = (err) => {
    if(err.code === '23505')
        return 'User already exist' 
}

const checkUserDetails = (details) => {
    let message = {email:'',name:'',password:''}
    if(!isEmail(details.email)){
        if(isEmpty(details.email)){
            message.email = 'Email cannot be empty'
        }else{message.email = `${details.email} is not a valid email`}   
    } 
    if(isEmpty(details.name))
        message.name = `Name cannot be empty`
    if(isEmpty(details.password))
        message.password = `Password cannot be empty`
    return message
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (email) => {
    //returns a token with a signature and headers are automatically applied
    return jwt.sign({email},'been working since the jump',{
        expiresIn: maxAge
    })
}
module.exports.signup = (req,res) => {
    const {name,email,password} = req.body
    // console.log(email, password,name) 
    const msg = checkUserDetails({name,email,password})
    if(msg.name !== '' || msg.email !== '' || msg.password !== ''){
        console.log(msg)
        res.status(400).json({msg})
    }else{
        bcrypt.hash(password, saltRounds).then( hash => {
            db('users')
            .returning('*')
            .insert({ email,name,password: hash,joined: new Date()})
            .then(user => {
                const token = createToken(email)
                //httpOnly: we can access it from the console (via js)
                res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000})
                res.status(201).json({email})})
            .catch(err => res.json({msg:handleErrors(err)}))//db

        }).catch(console.log)//bcrypt
        
    }
    
    }

module.exports.login = (req,res) => {
    const {email,password} = req.body

    const msg = checkUserDetails({name:'',email,password})
    if(msg.email !== '' || msg.password !== ''){
        console.log(msg)
        res.status(400).json({msg})
    }else{
        //look for user with email in db
        db.select('*').from('users')
        .where({email})
        .then(async (user) => {
            if(user.length === 0){
                res.status(400).json({error:'Incorrect email or password'})
            }else{ 
                //compare password
                //console.log()
                const match = await bcrypt.compare(password, user[0].password);
                const userObj = {name:user[0].name,email:user[0].email }
                if(match){
                    res.status(201).json({userObj})
                    //create a jwt and send that as response in a cookie
                }
                else{res.status(400).json({error:'Incorect email or password'})}}    
            const token = createToken(user[0].email)
            res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000})  
        })
        .catch(err => {res.status(400).json({error:'Cannot login at this time'})})
    }

    console.log(email, password)
}

module.exports.logout = (req,res) => {
    
}
