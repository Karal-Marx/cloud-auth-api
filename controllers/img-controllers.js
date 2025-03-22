const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinary-helper')
const fs = require('fs')
const path = require('path')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File is required'
            })
        }
        const {url, publicId} = await uploadToCloudinary(req.file.path);
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId,
            localPath : req.userInfo.localPath                             //change it
        })
        await newlyUploadedImage.save();

        res.status(201).json({
            success : true,
            message : "Image uploaded successfully",
            image : newlyUploadedImage
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Try again'
        })
    }
}

const fetchImageController = async(req, res)=>{
    try{
        //sorting and pagenation
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        
        //fetching image based on the constraints
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if (images){
            res.status(201).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data : images
            })
        }

    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Try again'
        })
    }
}

const deleteImageController = async (req, res) =>{
    try{
        // getting image and user id
        const getCurrentImageId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentImageId);
        if (!image){
            return res.status(400).json({
                success : false,
                message : "Image was not found"
            })
        }
        // checking if the user is able to delete the image
        if (image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : "You are not authorized to delete this message."
            })
        }
        //---------------------------
        console.log(image.localPath);
        //---------------------------
        //deleting the image

        await cloudinary.uploader.destroy(image.publicId);
        await Image.findByIdAndDelete(getCurrentImageId);

        const filePath = path.join(__dirname, '..', 'uploads', image.localPath);
        fs.unlinkSync(filePath);

        
        res.status(200).json({
            success : true,
            message : "Image was deleted successfully"
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Try again'
        })
    }
} 

module.exports = {uploadImageController, fetchImageController, deleteImageController};
