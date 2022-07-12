const { db } = require('../model/User')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.TOKEN
exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({ message: "Password less than 6 characters" });
    }
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          });
          res.status(201).json({
            message: "User successfully created",
            user: user._id,
            role: user.role,
          });
        })
        .catch((error) =>
          res.status(400).json({
            message: "User not successfully created",
            error: error.message,
          })
        );
    });
  };

exports.login = async (req, res, next) => {
    const {username,password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "user name or pasword empty"
    })
    }
    try {
        const user = await User.findOne({username, password});
        if(!user){
            res.status(401).json({
                message: "login unsuccesful",
                error: "user not found"
            })
        } else{
            bcrypt.compare(password, user.password).then(function(result){
                if(result){
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                      { id: user._id, username, role: user.role },
                      jwtSecret,
                      {
                        expiresIn: maxAge, // 3hrs
                      }
                    );
                    res.cookie("jwt", token, {
                      httpOnly: true,
                      maxAge: maxAge * 1000,
                    });
                    res.status(201).json({
                      message: "User logged in",
                      user: user._id,
                      role: user.role
                    });
                }else{
                    res.status(400).json({message: "login failed"})
                }
            }
            )}
    } catch (error) {
        res.status(400).json({
            message:"an error ocrrued", 
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
                                res.status(400).json({message: "error occured", error: err.message})
                                db.exit(1)
                            }
                            res.status(201).json({message:"update was uccesful"})
                        })
                    }else{
                        res.status(400).json({message: "user or admin doesnt exist"})
                    }
                  
                })
                .catch((err) => {
                    res.status(400).json({message: "error occured", error: error.message})
                })
        }else{
            res.status(400).json({
                message: "role is not admin"
            })
        }
    }else{
        res.status(400).json({
            message: "role or id missing"
        })
    }
}

exports.deleteUser = async (req , res, next) => {
    const {id} = req.body 
    await User.findById(id)
        .then(user => user.remove())
        .then(user => {
            res.status(201).json({message: "user delted", user})
            .catch(error =>{
                res
                .status(400)
                .json({message: "an error", errro: errormessage})
            })
        })
}

exports.getUsers = async(req, res, next) => {
  await User.find({})
    .then(users => {
      const userFunction = users.map(user => {
        const container = {}
        container.username = user.username
        container.role = user.role
        return container
      })
      res.status(200).json({user: userFunction})
    })
    .catch( err =>{
      res.status(401).json({message: "not succesful", error: err.message})
    })
}