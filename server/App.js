import Express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import OrderModel from "./model/Order.model.js";
import crypto from 'crypto';
dotenv.config()


import path from "path";

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

// const key = 'rzp_live_CFMWv5JxguuAjG';
// const keysecret = 'VF6B5lr1GoFYahuIF0xrHmDj';

const razorpayInstance = new Razorpay({
    key_id: key,
    key_secret: keysecret
});

app.use((req, res, next) => {
  
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
  });

app.get("/", (req, res)=>{
 res.send("<h1> server running</h>")
})



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

