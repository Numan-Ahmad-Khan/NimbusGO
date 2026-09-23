const { Op } = require("sequelize");

const User = require("../models/Users");
const Order = require("../models/Orders");
const Address = require("../models/Address");
const Config = require("../models/Config");
const Rider = require("../models/Rider");

const haversine = require("haversine-distance");


const getMe = async (req, res) => {
    try {

        const rider = await Rider.findOne({
            where: {
                id: req.user.riderId
            },

            attributes: {
                exclude: ["password"]
            }
        });


        if (!rider) {
            return res.status(404).json({
                msg: "Rider not found"
            });
        }


        return res.json({
            rider
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const updateOrder = async (req, res) => {
    try {

        const rider = await Rider.findOne({
            where: {
                id: req.user.riderId
            }
        });


        if (!rider) {
            return res.status(404).json({
                msg: "Rider not found"
            });
        }


        const order = await Order.findOne({
            where: {
                id: req.body.id
            }
        });


        if (!order) {
            return res.json({
                msg: "Invalid Order ID"
            });
        }


        if (
            order.riderId !==
            rider.id
        ) {
            return res.json({
                msg:
                    "Denied, cannot update"
            });
        }


        order.status =
            "DELIVERED";


        await order.save();


        return res.json({
            msg:
                "Status changed to delivered"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            error:
                "Internal server Error"
        });
    }
};


const updateLocation = async (req, res) => {
    try {

        const {
            latitude,
            longitude
        } = req.body;


        if (
            latitude === undefined ||
            longitude === undefined
        ) {

            return res.status(400).json({
                msg:
                    "Latitude and longitude are required"
            });
        }


        const rider =
            await Rider.findOne({
                where: {
                    id:
                        req.user.riderId
                }
            });


        if (!rider) {

            return res.status(404).json({
                msg:
                    "Rider not found"
            });
        }


        rider.latitude =
            latitude;

        rider.longitude =
            longitude;


        await rider.save();


        return res.json({

            msg:
                "Location updated successfully",

            latitude:
                rider.latitude,

            longitude:
                rider.longitude

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            msg:
                "Internal server error"
        });
    }
};


const getNearbyOrders = async (req, res) => {
    try {

        const rider =
            await Rider.findOne({
                where: {
                    id: req.user.riderId
                }
            });


        if (!rider) {

            return res.status(404).json({
                msg:
                    "Rider not found"
            });
        }


        if (!rider.isActive) {

            return res.status(403).json({
                msg:
                    "Rider account is inactive"
            });
        }


        /*
         * ONLINE:
         * paymentMethod = ONLINE
         * paymentStatus = PAID
         *
         * COD:
         * paymentMethod = COD
         * paymentStatus = PENDING
         *
         * Both are available to riders.
         */

        const orders =
            await Order.findAll({

                where: {

                    riderId: null,

                    [Op.or]: [

                        {
                            paymentMethod:
                                "ONLINE",

                            paymentStatus:
                                "PAID"
                        },

                        {
                            paymentMethod:
                                "COD",

                            paymentStatus:
                                "PENDING"
                        }

                    ]
                }
            });


        const nearbyOrders = [];


        for (
            const order of orders
        ) {

            /*
             * GET PICKUP ADDRESS
             */

            const pickupAddress =
                await Address.findOne({
                    where: {
                        id:
                            order.pickup
                    }
                });


            if (!pickupAddress) {
                continue;
            }


            /*
             * GET DROP ADDRESS
             */

            const dropAddress =
                await Address.findOne({
                    where: {
                        id:
                            order.drop
                    }
                });


            if (!dropAddress) {
                continue;
            }


            /*
             * CALCULATE DISTANCE
             * FROM RIDER TO PICKUP
             */

            const distance =
                haversine(

                    {
                        latitude:
                            Number(
                                rider.latitude
                            ),

                        longitude:
                            Number(
                                rider.longitude
                            )
                    },

                    {
                        latitude:
                            Number(
                                pickupAddress.latitude
                            ),

                        longitude:
                            Number(
                                pickupAddress.longitude
                            )
                    }

                ) / 1000;


            nearbyOrders.push({

                id:
                    order.id,

                orderName:
                    order.orderName,

                orderDetails:
                    order.orderDetails,


                /*
                 * PICKUP ADDRESS
                 */

                pickup: {

                    id:
                        pickupAddress.id,

                    street:
                        pickupAddress.street,

                    landmark:
                        pickupAddress.landmark,

                    pincode:
                        pickupAddress.pincode,

                    latitude:
                        pickupAddress.latitude,

                    longitude:
                        pickupAddress.longitude
                },


                /*
                 * DROP ADDRESS
                 */

                drop: {

                    id:
                        dropAddress.id,

                    street:
                        dropAddress.street,

                    landmark:
                        dropAddress.landmark,

                    pincode:
                        dropAddress.pincode,

                    latitude:
                        dropAddress.latitude,

                    longitude:
                        dropAddress.longitude
                },


                orderWeight:
                    order.orderWeight,

                orderLength:
                    order.orderLength,

                orderBreadth:
                    order.orderBreadth,

                orderHeight:
                    order.orderHeight,


                price:
                    order.price,

                originalAmount:
                    order.originalAmount,

                discountAmount:
                    order.discountAmount,

                finalAmount:
                    order.finalAmount,


                paymentMethod:
                    order.paymentMethod,

                paymentStatus:
                    order.paymentStatus,


                distance:
                    Number(
                        distance.toFixed(2)
                    )
            });
        }


        nearbyOrders.sort(
            (a, b) =>
                a.distance -
                b.distance
        );


        return res.json({
            orders:
                nearbyOrders
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            msg:
                "Internal server error"
        });
    }
};


module.exports = {

    getMe,

    updateOrder,

    updateLocation,

    getNearbyOrders

};