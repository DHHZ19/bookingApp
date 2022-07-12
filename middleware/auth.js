const jwt = require('jsonwebtoken');
const jwtSecret = process.env.TOKEN

exports.adminAuth = (req, res, next) => {
    const token = req.cookie.jwt
    if(token){
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({message: "not authorize"})
            }else {
                if(decodedToken.role !== 'admin'){
                    return res.status(401).json({message: "not authed"})
                }else{
                    next()
                }
            }
        })
    }else{
        return res
        .status(401)
        .json({message: "not authorized"})
    }
}
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }