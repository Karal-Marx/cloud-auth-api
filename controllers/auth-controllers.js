const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res)=>{
    try{
        //extracting credentials from the request
        const {username, email, password, role} = req.body

        //checking for the user using username and email
        const checkExistingUser = await User.findOne({$or : [{username}, {email}]})
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'Username/email already exists'
            })
        }
        //hashing password using bcrypt and uploading to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newlyCreatedUser = await User.create({
            username, 
            email,
            password : hashedPassword,
            role : role || 'user'
        })

        if (newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : 'User was registered successfully',
                data : newlyCreatedUser
            })
        }else{
            res.status(400).json({
                success : false,
                message : 'Unable to register the user'
            });
        }

    }catch(err){
        console.log("Error: ", err);
        res.status(500).json({
            success : false,
            message : "Something went wrong"
        });
    }
}

const loginUser = async(req, res)=>{
    try{
        //extraction of credentials from the request
        const {username, password} = req.body;

        //checking the database for the user
        const checkUser = await User.findOne({username});
        if(!checkUser){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials!"
            })
        }
        //checking for the correct password
        const passIsCorrect = await bcrypt.compare(password, checkUser.password);
        if(!passIsCorrect){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials!"
            })
        }

        //generating access token for the user using jwt
        const accessToken = jwt.sign({
            userId : checkUser._id,
            username : checkUser.username,
            role : checkUser.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '30m'
        })

        res.status(200).json({
            success : true,
            message : 'Logged in successfully', 
            accessToken
        })


    }catch(err){
        console.log("Error: ", err);
        res.status(500).json({
            success : false,
            message : "Something went wrong"
        });
    }
}

const changePassword = async(req, res)=>{
    try{

        //getting userid from userInfo
        const userId = req.userInfo.userId;

        //getting the old and new password
        const {oldPass, newPass} = req.body;
        //checking for the existence of the user in the database
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success : false,
                message : 'User not found'
            })
        }

        //checking if the old password is legit
        const checkPassword = await bcrypt.compare(oldPass, user.password);
        if(!checkPassword){
            return res.status(400).json({
                success : false, 
                message : 'Old password is not correct'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPass, salt);

        //updating the user password
        user.password = newHashedPassword
        await user.save(); 
        res.status(200).json({
            success : true,
            message : 'Password changed successfully'
        })

    }catch(err){
        console.status(500).json({
            success : false,
            message : 'Something went wrong! Try again.'
        })
    }
}

module.exports = {registerUser, loginUser, changePassword};