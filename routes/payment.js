const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
const razorpayInstance = require('../utils/razorpay');
const PaymentModel = require('../model/payment');
const { membershipAmount } = require('../utils/constant');
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../model/user');
require('../config/config');

//  to create order using razorpay
router.post('/createOrder', authenticate, async (req, res) => {

    try {
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[req?.body?.membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName: req?.user?.firstName,
                lastName: req?.user?.lastName,
                membershipType: req?.body?.membershipType
            }
        });

        // Save it in my database
        const payment = new PaymentModel({
            userId: req.user?.id,
            orderId: order?.id,
            status: order?.status,
            amount: order?.amount,
            currency: order?.currency,
            receipt: order?.receipt,
            notes: order?.notes,
        });

        const savedPayment = await payment.save();

        // return the order details to frontend
        res.json({ ...savedPayment.toJSON(), keyId: CONFIG.RAZORPAY_KEYID });
    } catch (error) {
        res.status(500).send('error while creating order',error.message);
    }

});

// webhookapi endpoint which return whether the payment succeded or failed.
router.post('/payment/webhook',async(req,res)=>{
    try {
        const webhookSignature = req.headers["X-Razorpay-Signature"];

        const isValidatedsignature = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, CONFIG.RAZORPAY_WEBHOOK_SECRET);

        if(!isValidatedsignature) return res.status(400).json({message:"webhook signature is invalid"});

        // update my payment status
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await PaymentModel.findOne({orderId:paymentDetails?.order_id});
        payment.status = paymentDetails?.status;
        await payment.save();

        // update the user as premium
        const user = await User.find({_id:payment.userId});
        user.isPremium= true;
        user.membershipType=payment?.notes?.membershipType;
        await User.save();

        // if(req?.body?.event === 'payment.captured'){
        // }
        // else if(req?.body?.event === 'payment.failed'){
        // }

        // return success response to razorpay (confirmation that we recieved the event else it will retry by sending the request event)
        return res.status(200).message({message:"webhook recieved successfully"});
    } catch (error) {
        return res.status(400).message({message:error.message});
    }
});

module.exports = { router };