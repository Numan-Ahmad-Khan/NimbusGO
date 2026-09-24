const crypto = require("crypto");

const Order = require("../models/Orders");
const Coupon = require("../models/Coupon");
const CouponUsage = require("../models/CouponUsage");

const webhook = async (req, res) => {
    try {
        const signature =
            req.headers["x-razorpay-signature"];

        // Verify webhook signature using raw body
        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_WEBHOOK_SECRET
                )
                .update(req.body)
                .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({
                message: "Invalid webhook signature",
            });
        }

        console.log(
            "Webhook signature verified"
        );

        // Parse only AFTER signature verification
        const webhookData =
            JSON.parse(
                req.body.toString()
            );

        const event = webhookData.event;

        console.log(
            "Webhook event:",
            event
        );

        /*
        ==========================================
        PAYMENT SUCCESSFUL
        ==========================================
        */

        if (
            event === "payment_link.paid"
        ) {
            const paymentLink =
                webhookData
                    .payload
                    .payment_link
                    .entity;

            const orderId =
                paymentLink.reference_id;

            if (!orderId) {
                console.log(
                    "Payment link has no reference_id"
                );

                return res.status(200).json({
                    message:
                        "Webhook received but no order reference found",
                });
            }

            const order =
                await Order.findByPk(
                    orderId
                );

            if (!order) {
                console.log(
                    "Order not found:",
                    orderId
                );

                return res.status(404).json({
                    message:
                        "Order not found",
                });
            }

            // Make sure this is an online order
            if (
                order.paymentMethod !==
                "ONLINE"
            ) {
                console.log(
                    `Order ${order.id} is not an ONLINE order`
                );

                return res.status(200).json({
                    message:
                        "Order is not an online payment",
                });
            }

            // Prevent duplicate webhook processing
            if (
                order.paymentStatus ===
                "PAID"
            ) {
                console.log(
                    `Order ${order.id} is already PAID`
                );

                return res.status(200).json({
                    message:
                        "Order already processed",
                });
            }

            // Mark payment as successful
            await order.update({
                paymentStatus: "PAID",
            });

            console.log(
                `Order ${order.id} payment marked as PAID`
            );

            /*
            ==========================================
            COUPON USAGE
            ==========================================
            */

            if (order.couponCode) {
                const coupon =
                    await Coupon.findOne({
                        where: {
                            code: order.couponCode,
                        },
                    });

                if (coupon) {
                    const existingUsage =
                        await CouponUsage.findOne({
                            where: {
                                couponId:
                                    coupon.id,
                                userId:
                                    order.userId,
                                orderId:
                                    order.id,
                            },
                        });

                    if (!existingUsage) {
                        await CouponUsage.create({
                            id:
                                crypto.randomUUID(),
                            couponId:
                                coupon.id,
                            userId:
                                order.userId,
                            orderId:
                                order.id,
                            discountAmount:
                                order.discountAmount,
                        });

                        await coupon.increment(
                            "usedCount",
                            {
                                by: 1,
                            }
                        );

                        console.log(
                            `Coupon ${coupon.code} usage recorded`
                        );
                    } else {
                        console.log(
                            `Coupon already recorded for order ${order.id}`
                        );
                    }
                }
            }
        }

        /*
        ==========================================
        PAYMENT LINK EXPIRED
        ==========================================
        */

        if (
            event ===
                "payment_link.expired"
        ) {
            const paymentLink =
                webhookData
                    .payload
                    .payment_link
                    .entity;

            const orderId =
                paymentLink.reference_id;

            if (!orderId) {
                console.log(
                    "Expired payment link has no reference_id"
                );

                return res.status(200).json({
                    message:
                        "Webhook received but no order reference found",
                });
            }

            const order =
                await Order.findByPk(
                    orderId
                );

            if (!order) {
                console.log(
                    "Order not found:",
                    orderId
                );

                return res.status(200).json({
                    message:
                        "Order not found",
                });
            }

            // Never change a successfully paid order to FAILED
            if (
                order.paymentStatus ===
                "PAID"
            ) {
                console.log(
                    `Order ${order.id} is already PAID`
                );

                return res.status(200).json({
                    message:
                        "Order already paid",
                });
            }

            await order.update({
                paymentStatus: "FAILED",
            });

            console.log(
                `Order ${order.id} payment marked as FAILED because payment link expired`
            );
        }

        /*
        ==========================================
        PAYMENT LINK CANCELLED
        ==========================================
        */

        if (
            event ===
                "payment_link.cancelled"
        ) {
            const paymentLink =
                webhookData
                    .payload
                    .payment_link
                    .entity;

            const orderId =
                paymentLink.reference_id;

            if (!orderId) {
                console.log(
                    "Cancelled payment link has no reference_id"
                );

                return res.status(200).json({
                    message:
                        "Webhook received but no order reference found",
                });
            }

            const order =
                await Order.findByPk(
                    orderId
                );

            if (!order) {
                console.log(
                    "Order not found:",
                    orderId
                );

                return res.status(200).json({
                    message:
                        "Order not found",
                });
            }

            // Never change a successfully paid order to FAILED
            if (
                order.paymentStatus ===
                "PAID"
            ) {
                console.log(
                    `Order ${order.id} is already PAID`
                );

                return res.status(200).json({
                    message:
                        "Order already paid",
                });
            }

            await order.update({
                paymentStatus: "FAILED",
            });

            console.log(
                `Order ${order.id} payment marked as FAILED because payment link was cancelled`
            );
        }

        return res.status(200).json({
            message:
                "Webhook processed successfully",
        });

    } catch (err) {
        console.log(
            "Webhook error:",
            err
        );

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

module.exports = {
    webhook,
};