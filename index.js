// const port = 4000 || process.env.port;
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors")
// const jwt = require("jsonwebtoken")
// const bcrypt = require('bcrypt')
// require("dotenv").config(); 
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const { METHODS } = require("http");
          
// cloudinary.config({ 
//   cloud_name: process.env.CLOUD_NAME, 
//   api_key: process.env.API_KEY, 
//   api_secret: process.env.API_SECRET
// });

// app.use(express.json());
// const corsOptions = {
//   origin: 'https://e-commerce-frontend-bice-nine.vercel.app/',
//   methods:["GET","POST","PUT","DELETE"],
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));



// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_DB);

// // API creation
// app.get("/", (req, res) => {
//     res.send("Express app is running");
// });
// const uploadOnCloudinary = async (localFilePath) =>{
//     try{
//         if(!localFilePath) return null
//         const response=await cloudinary.uploader.upload(localFilePath,{
//             resource_type: "auto"
//         }) 
//         console.log("file is uploded on cloudinary",response.url);
//         return response
//     }catch(error){
//         fs.unlinkSync(localFilePath)
//         return null;
//     }
// }

// // Image storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file,cb){
//         cb(null,'./upload/images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const upload = multer({ storage: storage });

// // Endpoint for uploading images
// app.use('/images', express.static('upload/images'));
// // app.post("/upload", upload.single('product'), (req, res) => {
// //     res.json({
// //         success: 1,
// //         image_url: `http://localhost:${port}/images/${req.file.filename}`
// //     });
// // });
// app.post("/upload", upload.single('product'), async (req, res) => {
//     try {
//         // Upload image to local directory
//         const localFilePath = req.file.path;

//         // Upload image to Cloudinary
//         const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

//         // Response with image URLs
//         res.json({
//             success: 1,
//             local_image_url: `http://localhost:${port}/images/${req.file.filename}`,
//             cloudinary_image_url: cloudinaryResponse.url
//         });
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         res.status(500).json({ success: 0, error: "Internal Server Error" });
//     }
// });

// // Schema for creating product
// const Product = mongoose.model("product", {
//     id: {
//         type: Number,
//         required: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     image: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     new_price: {
//         type: Number,
//         required: true,
//     },
//     old_price: {
//         type: Number,
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: Date.now,
//     },
//     available: {
//         type: Boolean,
//         default: true,
//     }
// });



// //creating users schema
// const Users=mongoose.model('Users',{
//     name:{
//         type:String,

//     },
//     email:{
//         type: String,
//         unique:true,

//     },
//     password:{
//         type:String,
//     },
//     cartData:{
//         type:Object,
//     },
//     date:{
//         type:Date,
//         default:Date.now,
//     }
// })

// // Creating Endpoint For registering the user
// app.post('/signup', async (req,res)=>{
//     let check = await Users.findOne({email:req.body.email});
//     const salt = await bcrypt.genSalt(8);
//     const hashedPass = await bcrypt.hash(req.body.password,salt)

//     req.body.password = hashedPass;
//     if(check){
//         return res.status(400).json({success:false,errors:"Existing User found with same email id"});
//     }
//     let cart={};
//     for(let i=0;i<100;i++){
//         cart[i]=0;
//     }
//     const user= new Users({
//         name:req.body.username,
//         email:req.body.email,
//         password:req.body.password,
//         cartData:cart,
//     })

//     await user.save();
//     const data= {
//         user:{
//             id:user.id
//         }
//     }
//     const token =jwt.sign(data,process.env.KEY);
//     res.json({success:true,token})
// })
// //creating endpoint for user login
// app.post('/login',async(req,res)=>{
//     let user = await Users.findOne({email:req.body.email});
//     if(user){
//         const passCompare = await bcrypt.compare(req.body.password,user.password)
//         // const passCompare = req.body.password===user.password;
//         if(passCompare){
//             const data={
//                 user:{
//                     id:user.id
//                 }
//             }
//             const token=jwt.sign(data,process.env.KEY);
//             res.json({success:true,token})
//         }
//         else{
//             res.json({success:false,errors:"Wrong 1 Password"})
//         }
//     }
//     else{
//         res.json({success:false,errors:"Wrong emailId"})
//     }
// })

// // Endpoint for adding a product
// app.post('/addproduct', async (req, res) => {
//     let products = await Product.find({});
//     let id;
//     if(products.length>0){
//         let last_product_array = products.slice(-1);
//         let last_product = last_product_array[0];
//         id= last_product.id+1;
//     }
//     else{
//         id=1;
//     }
//     const product = new Product({
//         id:id,
//         name: req.body.name,
//         image: req.body.image,
//         category: req.body.category,
//         new_price: req.body.new_price,
//         old_price: req.body.old_price,
//     });
//     console.log(product);
//     await product.save();
//     console.log("Saved");
//     res.json({
//         success: true,
//         name: req.body.name,
//     });
// });
// //creating api to delete product
// // app.post('/removeproduct',async(res,req)=>{
// //     await Product.findOneAndDelete({id:req.body.id});
// //     console.log("Removed");
// //     res.json({
// //         success:true,
// //         name:req.body.name
// //     })
// // })
// app.post('/removeproduct', async (req, res) => {
//     try {
//         await Product.findOneAndDelete({ id: req.body.id });
//         console.log("Removed");
//         res.json({
//             success: true,
//             name: req.body.name
//         });
//     } catch (error) {
//         console.error("Error removing product:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });
// // create api for getting all products
// app.get('/allproducts', async (req,res)=>{
//     let products= await Product.find({});
//     console.log("All products fetched");
//     res.send(products);
// })

// // GET request to fetch an image
// app.get('/fetch-image/:imageName', (req, res) => {
//     const imageName = req.params.imageName;
//     res.sendFile(path.join(__dirname, `upload/images/${imageName}`));
// });

// //creating endpoint for new collection
// // app.get('./newcollections',async(req,res)=>{
// //     let product =await Product.find({});
// //     let newcollection = product.slice(1).slice(-8);
// //     console.log("NewCollection Feched");
// //     res.send(newcollection);
// // })
// app.get('/newcollections', async (req, res) => {
//     try {
//         let products = await Product.find({});
//         let newCollection = products.slice(1).slice(-8);
//         console.log("New Collection Fetched");
//         res.send(newCollection);
//     } catch (error) {
//         console.error("Error fetching new collections:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// app.get('/relatedproducts/:category', async (req, res) => {
//     try {
//         const category = req.params.category;
//         const products = await Product.find({ category: category });
//         const relatedProducts = products.slice(0, 4);
//         res.json(relatedProducts);
//     } catch (error) {
//         console.error("Error fetching related products:", error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });

// //  creating end point for popular in women
// app.get('/popularinwomen', async (req, res) => {
//     try {
//         let products = await Product.find({ category: "women" });
//         let popular_in_women = products.slice(0, 4);
//         console.log("Popular items fetched");
//         res.send(popular_in_women);
//     } catch (error) {
//         console.error("Error fetching popular items for women:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });
// //creating a middelware to feach user
// const fetchUser = async(req,res,next)=>{
//     const token = req.header('auth-token');
//     if(!token){
//         res.status(401).send({errors:"Please authenticate using valid token"})

//     }
//     else{
//         try{
//             const data = jwt.verify(token,'secret_ecom');
//             req.user= data.user
//             next();
//         }
//         catch(error){
//             res.status(401).send({errors:"Please authenticate using valid token"})
//         }
//     }
// }
// // creating endpoint for adding product in cart data
// app.post('/addtocart', fetchUser, async (req, res) => {
//     try {
//         console.log("Request Body:", req.body);

//         // Fetch user data
//         let userData = await Users.findOne({ _id: req.user.id });
//         if (!userData) {
//             return res.status(404).send("User not found");
//         }

//         // Ensure cartData is initialized as an empty object if it doesn't exist
//         userData.cartData = userData.cartData || {};

//         // Increase item count in cartData
//         userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;

//         // Update user document with modified cartData
//         await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

//         // Send response
//         res.send("Added to cart");
//     } catch (error) {
//         console.error("Error adding item to cart:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });
// // Endpoint for removing a product from cartData
// app.post('/removefromcart', fetchUser, async (req, res) => {
//     try {
//         console.log(" Removed Request Body:", req.body);

//         // Fetch user data
//         let userData = await Users.findOne({ _id: req.user.id });

//         if (!userData) {
//             return res.status(404).send("User not found");
//         }

//         // Ensure cartData is initialized as an empty object if it doesn't exist
//         userData.cartData = userData.cartData || {};

//         // Check if the item exists in cartData
//         if (userData.cartData.hasOwnProperty(req.body.itemId)) {
//             // Decrement item count in cartData
//             if (userData.cartData[req.body.itemId] > 0) {
//                 userData.cartData[req.body.itemId] -= 1;
//             }
//             // Remove item if count becomes 0
//             if (userData.cartData[req.body.itemId] === 0) {
//                 delete userData.cartData[req.body.itemId];
//             }
//         }
//         // get cart data

//         // Update user document with modified cartData
//         await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

//         // Send response
//         res.send("Removed from cart");
//     } catch (error) {
//         console.error("Error removing item from cart:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


// // app.post('/getcart',fetchUser,async (req,res)=>{
// //     console.log("GetCart");
// //     let userData = await Users.findOne({_id:req.user.id});
// //     res.json(userData.cartData);
// // })
// app.post('/getcart', fetchUser, async (req, res) => {
//     console.log("GetCart");
//     try {
//         let userData = await Users.findOne({ _id: req.user.id });
//         if (userData) {
//             res.json(userData.cartData);
//         } else {
//             // User not found, send appropriate response
//             res.status(404).json({ error: "User not found" });
//         }
//     } catch (error) {
//         // Handle any errors that occur during database query or processing
//         console.error("Error fetching user data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });



// app.listen(port, (error) => {
//     if (!error) {
//         console.log("Server running on port " + port);
//     } else {
//         console.log("Error: " + error);
//     }
// });
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config(); 
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

app.use(express.json());
const corsOptions = {
  origin: 'https://e-commerce-frontend-bice-nine.vercel.app',
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB);

// API creation
app.get("/", (req, res) => {
    res.json({ message: "Express app is running" });
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("File is uploaded on Cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

// Image storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Static images route
app.use('/images', express.static('upload/images'));

// Image upload endpoint
app.post("/upload", upload.single('product'), async (req, res) => {
    try {
        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        res.json({
            success: 1,
            local_image_url: `http://localhost:${port}/images/${req.file.filename}`,
            cloudinary_image_url: cloudinaryResponse.url
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: 0, error: "Internal Server Error" });
    }
});

// Product Schema
const Product = mongoose.model("product", {
    id: Number,
    name: String,
    image: String,
    category: String,
    new_price: Number,
    old_price: Number,
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

// Users Schema
const Users = mongoose.model('Users', {
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now }
});

// User Signup
app.post('/signup', async (req, res) => {
    const check = await Users.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(8);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPass;
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with the same email id" });
    }

    const cart = Array.from({ length: 100 }, () => 0);
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.KEY);
    res.json({ success: true, token });
});

// User Login
app.post('/login', async (req, res) => {
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = { user: { id: user.id } };
            const token = jwt.sign(data, process.env.KEY);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong emailId" });
    }
});

// Add Product
app.post('/addproduct', async (req, res) => {
    const products = await Product.find({});
    const id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

    const product = new Product({
        id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
});

// Remove Product
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Fetch all products
app.get('/allproducts', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// Fetch new collections
app.get('/newcollections', async (req, res) => {
    try {
        const products = await Product.find({});
        const newCollection = products.slice(1, 9);
        res.json(newCollection);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch related products
app.get('/relatedproducts/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });
        const relatedProducts = products.slice(0, 4);
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Popular in Women
app.get('/popularinwomen', async (req, res) => {
    try {
        const products = await Product.find({ category: "women" });
        const popularInWomen = products.slice(0, 4);
        res.json(popularInWomen);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.KEY);
        req.user = data.user;
        next();
    } catch {
        res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
};

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).json({ error: "User not found" });

        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ message: "Added to cart" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(404).json({ error: "User not found" });

        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            if (userData.cartData[req.body.itemId] === 0) delete userData.cartData[req.body.itemId];
        }
        await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ message: "Removed from cart" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get cart data
app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.user.id });
        if (userData) res.json(userData.cartData);
        else res.status(404).json({ error: "User not found" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Server initialization
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
