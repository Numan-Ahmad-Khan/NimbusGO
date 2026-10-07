const Order = require("../models/Orders");
const Address = require("../models/Address");
const Checkpoint = require("../models/Checkpoint");

const haversine = require("haversine-distance");


const trackOrderPublic = async (req, res, next) => {

    try {

        const { orderId } = req.params;

        const order = await Order.findOne({

            where: {
                id: orderId,
            },

            attributes: [
                "id",
                "orderName",
                "status",
                "transitDetail",
                "drop",
                "updatedAt",
            ],

        });


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found",

            });

        }

        let transitData = null;


        if (
            order.transitDetail &&
            order.transitDetail !==
                "No details yet"
        ) {

            transitData =
                await Checkpoint.findOne({

                    where: {
                        id:
                            order.transitDetail,
                    },

                    attributes: [
                        "id",
                        "checkpointName",
                        "checkpointDetail",
                        "longitude",
                        "latitude",
                    ],

                });

        }
        const dropAddress =
            await Address.findOne({

                where: {
                    id:
                        order.drop,
                },

                attributes: [
                    "latitude",
                    "longitude",
                ],

            });

        let remainingDistance = null;


        if (
            dropAddress &&
            transitData
        ) {

            remainingDistance =
                haversine(

                    {
                        latitude:
                            dropAddress.latitude,

                        longitude:
                            dropAddress.longitude,
                    },

                    {
                        latitude:
                            transitData.latitude,

                        longitude:
                            transitData.longitude,
                    }

                ) / 1000;


            remainingDistance =
                Number(
                    remainingDistance.toFixed(2)
                );

        }

        let location = null;


        if (transitData) {

            location = {

                name:
                    transitData.checkpointName,

                details:
                    transitData.checkpointDetail,

                latitude:
                    transitData.latitude,

                longitude:
                    transitData.longitude,

            };

        } else {

            location = {

                name:
                    "Not Dispatched",

                details:
                    "Order has not reached a transit checkpoint yet.",

                latitude:
                    null,

                longitude:
                    null,

            };

        }

        return res.status(200).json({

            success: true,

            orderId:
                order.id,

            orderName:
                order.orderName,

            status:
                order.status,

            location:

                location,

            remainingDistance:
                remainingDistance,

            lastUpdatedAt:
                order.updatedAt,

        });


    } catch (error) {

        next(error);

    }

};


module.exports = {
    trackOrderPublic,
};