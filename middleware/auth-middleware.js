const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(" ")[1];
    //token
    if (!token){
        return res.status(401).json({
            success : false,
            message : 'Access Denied!! Please log in to continue'
        })
    }

    try{
        //decoding and extracting info from the access token generated by the jwt
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(decodedToken)
        
        //storing the user credentials inside userInfo
        req.userInfo = decodedToken
        next()    
    }catch(err){
        return res.status(500).json({
            success : false, 
            message : 'Something went wrong'
        })
    }

    
}

module.exports = authMiddleware;