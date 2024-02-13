import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import OrderModel from "./model/Order.model.js";
import crypto from 'crypto';
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
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        if (connection) {
            console.log(`mongoDB connected`)
        }
    } catch (e) {
        console.log(e.message);
    }
};

const key = 'rzp_live_uZqf3G3ZLTSKbH';
const keysecret = 'qcLK213WvGgzZQfRHTW3woDL';

const razorpayInstance = new Razorpay({
    key_id: key,
    key_secret: keysecret
});






// get product
app.post("/api/payment/checkout", async (req, res) => {
    try {
        const { name, amount } = req.body;
        const order = await razorpayInstance.orders.create({
            amount: Number(amount * 100),
            currency: "INR",

        })

        await OrderModel.create({
            order_id: order.id,
            name: name,
            amount: amount
        })
        console.log({ order })
        res.json(order)
    }
    catch (e) {
        console.log(e.message)
    }
})

app.post("/api/payment/payment-verification", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const body_dada = razorpay_order_id + " " + razorpay_payment_id

        const expect = crypto.createHmac('sha256', 'qcLK213WvGgzZQfRHTW3woDL')
            .update(body_dada).digest('hex')

        const isValid = expect === razorpay_signature;
        if (isValid) {
            await OrderModel.findOne({ order_id: razorpay_order_id }, {
                $set: {
                    razorpay_payment_id, razorpay_order_id, razorpay_signature
                }
            })
            res.redirect(`http://localhost:3000/success?payment_id=${razorpay_payment_id}`)
            return
        }
        else {
            res.redirect("http://localhost:3000/failed")
            return
        }

    }
    catch (e) {
        console.log(e.message)
    }
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





if (process.env.NODE_ENV === "production") {
    app.use(Express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
    });
}




app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`)
    connectDB();
})

