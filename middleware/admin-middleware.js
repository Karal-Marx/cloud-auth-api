

const isAdmin = (req, res, next)=>{
    if (req.userInfo.role !== 'admin'){
        return res.status(403).json({
            success : false,
            message : "This page can only be accessed by admins"
        }) 
    }
    next();
}

module.exports = isAdmin;