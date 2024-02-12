import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config()

// import product from "./models/product.js";
// import order  from './models/order.js';
// import md5 from "md5";
import path from "path";
// import auth from "./models/auth.js";
const __dirname = path.resolve();

const app = Express();
app.use(Express.json());

const PORT = process.env.PORT || 5000; 

const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI)
    if (connection) {
        console.log(`mongoDB connected`)
    }
    } catch(e){
        console.log(e.message);
    }
};

const key = 'rzp_live_uZqf3G3ZLTSKbH';
const keysecret='qcLK213WvGgzZQfRHTW3woDL' ;

const razorpayInstance = new Razorpay({ 
    key_id: key  , 
    key_secret:keysecret 
}); 



// signup
// app.post("/api/signup", async (req, res) => {
//     const { name, email, mobile, address, password, gender } = req.body;
//     const newUser = new auth({
//         name,
//         email,
//         mobile,
//         address,
//         password : md5(password),
//         gender,
//     });

//     try {
//         const saveuser = await newUser.save();
//         res.json({
//             success: true,
//             data: saveuser,
//             message: "user created successfully."

//         })
//     } catch (e) {
//         res.json({
//             success: false,
//             message: e.message
//         })
//     }
// }
// )

// post login
// app.post("/api/login", async (req, res) => {
//     const { email, password   } = req.body;

//     if (!email || !password) {
//         return res.json({
//             success: false,
//             message: "invalid email and password"
//         })
//     }

//     const user = await auth.findOne({
//         email: email,
//         password: md5(password)
//     })
//     if (user) {
//         res.json({
//             success: true,
//             data: user,
//             message: "login succesfull"
//         })
//     }
//     else {
//         res.json({
//             success: false,

//             message: "invalid data"
//         })
//     }
// })



// get product
app.get("/api/payment/checkout", async (req, res) => {
    const { name, amount } = req.body;
    const order = await razorpayInstance.orders.create({
        amount: Number(amount*100),
        currency: "INR",
        re
    }) 

    res.json(order)
})

// delet product
// app.delete("/api/product/:_id", async (req, res) => {
//     const { _id } = req.params;
//     const product1 = await product.deleteOne({ _id: _id })
//     res.json({
//         success: true,
//         data: product1,
//         message: `successfully deleted one product data. `,
//     });
// })

// get product search
// app.get("/api/products/search", async (req, res) => {
//     const { q } = req.query;
//     try {
//         const product1 = await product.find({ title: { $regex: q, $options: "i" } })
//         res.json({
//             success: true,
//             data: product1,
//             message: `successfully searched product. `,
//         });
//     }
//     catch (e) {
//         res.json({
//             success: false,
//             message: e.message
//         })
//     }
// })

// post order 
// app.post("/api/order", async (req, res) => {
//     const { user, product, shipingaddress, status, quentity , deliverycharge} = req.body;

//     const neworder = new order({
//         user,
//         product,
//         shipingaddress,
//         status,
//         quentity,
//         deliverycharge
//     })
//    try{
//     const savedata = await neworder.save();
   
//     res.json({
//         success: true,
//         data: savedata,
//         message: "new order  successfully."
//     })
//    }
//    catch (e) {
//     res.json({
//         success: false,
//         message: e.message
//     })
// }
 
// })





 if(process.env.NODE_ENV === "production"){
    app.use(Express.static(path.join(__dirname, '..', 'client', 'build'))); 
   
    app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
    });
   }




app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`)
    connectDB();
})

