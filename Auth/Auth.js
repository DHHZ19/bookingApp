const { db } = require('../model/User')
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

exports.login = async (req, res, next) => {
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: 'username or password is empty'
    })
    }
    try {
        const user = await User.findOne({username, password});
        if(!user){
            res.status(401).json({
                message: 'Login unsuccesful',
                error: 'user not found'
            })
        } else{
            res.status(200).json({
                message: 'login succesful',
                user,
            })
        }
    } catch (error) {
        res.status(400).json({
            message: 'an error ocurred', 
            error: error
        })
    }    
}

exports.update = async (req, res, next) => {
    const {role, id} = req.body
    if(role && id){
        if(role === 'admin'){
            await User.findById(id)
                .then((user) => {
                    if(user.role  !== 'admin'){
                        user.role = role
                        user.save((err) => {
                            if(err){
                                res.status(400).json({message: 'error occured', error: err.message})
                                db.exit(1)
                            }
                            res.status(201).json({message: 'Update was succesful'})
                        })
                    }else{
                        res.status(400).json({message: 'User is already an admin'})
                    }
                  
                })
                .catch((err) => {
                    res.status(400).json({message: 'an error occured', error: error.message})
                })
        }else{
            res.status(400).json({
                message: 'Role is not admin'
            })
        }
    }else{
        res.status(400).json({
            message: 'Role or ID is missing'
        })
    }
}