const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./Pictures",
  filename: function (req, file, callback) {
    callback(null, "image-" + file.originalname);
  },
});

const storePicture = multer({ storage: storage });

 //===========================Image upload ====================
function uploadImage(req, res, next) {
  storePicture.single("image")(req, res, function (err) {
    if (err) {
      console.log("Image Upload ERROR:", err);
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }
    // Assuming you want to access the uploaded image's filename in the request body
    console.log("file",req.file);
    console.log("path",req.file.path);
    
    req.body.imagePath = req.file ? req.file.path : null;
    // Do something with req.body.image
   
    next();
  });
}

module.exports = uploadImage;
