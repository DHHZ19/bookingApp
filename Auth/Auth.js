const User = require('../model/User')


exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if(password.length < 6){
        return res.status(400).json({message: 'password less than 6 characters'})
    }
    try{
        await User.create({
            username,
            password,
        })
    }catch(error){
        res.status(400).json({
            message: "User not successfully created",
            error: error.message,
    })
    }
}