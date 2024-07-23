import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary= async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        // upload file on cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        // file has benn uploaded succesfully
        comsole.log("file is uploaded succesfully ",responce.url)
        return responce
    } catch (error) {
        fs.unlinkSync(localFilePath)
        // removed the localy saved temp file as the upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}







// const uploadResult = await cloudinary.uploader
//     .upload(
//         'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//             public_id: 'shoes',
//         }
//     )
//     .catch((error) => {
//         console.log(error);
//     });

//  console.log(uploadResult);
