const User = require("../models/Users");
const Config = require("../models/Config");
const Order = require("../models/Orders");
const Checkpoint = require("../models/Checkpoint");

const { sendEmail } = require("../services/email.services");

const getMe = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.userId
            },
            attributes: {
                exclude: ["password"]
            }
        });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        return res.json({
            user
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Server Error"
        });
    }
};


const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                "id",
                "userId",
                "orderName",
                "status"
            ]
        });

        if (!order) {
            return res.status(404).json({
                message: "Invalid Order ID"
            });
        }

        // Get user separately — NO Sequelize relation
        const user = await User.findOne({
            where: {
                id: order.userId
            },
            attributes: [
                "name",
                "email"
            ]
        });

        return res.json({
            Success: "Order Status",
            Details: {
                id: order.id,
                orderName: order.orderName,
                status: order.status,
                userName: user?.name || "Unknown User",
                userEmail: user?.email || "Unknown Email"
            }
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const changeOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!order) {
            return res.status(404).json({
                Error: "Order Id invalid"
            });
        }

        const oldStatus = order.status;

        order.status = status;

        await order.save();

        return res.json({
            msg: "Updated status",
            oldStatus: oldStatus,
            newStatus: status
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const updateCheckpoint = async (req, res) => {
    try {
        const { checkpointId } = req.body;

        const order = await Order.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!order) {
            return res.status(404).json({
                Error: "Order Id invalid"
            });
        }

        if (order.status !== "IN_TRANSIT") {
            return res.status(400).json({
                msg: "Order not in transit"
            });
        }

        // Make sure checkpoint exists
        const checkpoint = await Checkpoint.findOne({
            where: {
                id: checkpointId
            }
        });

        if (!checkpoint) {
            return res.status(404).json({
                msg: "Checkpoint not found"
            });
        }

        order.transitDetail = checkpointId;

        await order.save();

        return res.json({
            msg: "Checkpoint Added",
            checkpoint
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const getOrderList = async (req, res) => {
    try {
        const orders = await Order.findAll({
            attributes: [
                "id",
                "userId",
                "orderName",
                "status"
            ]
        });

        // Get users separately — NO Sequelize relation
        const users = await User.findAll({
            attributes: [
                "id",
                "name",
                "email"
            ]
        });

        // Create a map:
        // userId -> user name/email
        const userMap = new Map();

        users.forEach(user => {
            userMap.set(user.id, {
                name: user.name,
                email: user.email
            });
        });

        const orderList = orders.map(order => {
            const user = userMap.get(order.userId);

            return {
                id: order.id,
                orderName: order.orderName,
                status: order.status,

                userName: user?.name || "Unknown User",
                userEmail: user?.email || "Unknown Email"
            };
        });

        return res.json({
            Details: orderList
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const getUserList = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password"]
            }
        });

        return res.json({
            user_list: users
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const changeRate = async (req, res) => {
    try {
        const {
            rateDistance,
            rateDimensions,
            rateWeight
        } = req.body;

        if (
            rateDistance === undefined ||
            rateDistance === null ||
            (
                typeof rateDistance === "object" &&
                Object.keys(rateDistance).length === 0
            )
        ) {
            return res.status(400).json({
                Error: "Cannot be empty/undefined"
            });
        }

        if (
            rateDimensions === undefined ||
            rateDimensions === null ||
            (
                typeof rateDimensions === "object" &&
                Object.keys(rateDimensions).length === 0
            )
        ) {
            return res.status(400).json({
                Error: "Cannot be empty/undefined"
            });
        }

        if (
            rateWeight === undefined ||
            rateWeight === null ||
            (
                typeof rateWeight === "object" &&
                Object.keys(rateWeight).length === 0
            )
        ) {
            return res.status(400).json({
                Error: "Cannot be empty/undefined"
            });
        }

        await Config.upsert({
            id: "SINGLETON",

            rateKeyDistance: "RATE_PER_KM",
            rateValueDistance: rateDistance,

            rateKeyDimensions: "RATE_VOLUME",
            rateValueDimensions: rateDimensions,

            rateKeyWeight: "RATE_PER_KG",
            rateValueWeight: rateWeight
        });

        return res.json({
            msg: "Success, rates have been updated"
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const addCheckpoint = async (req, res) => {
    try {
        const {
            checkpointName,
            checkpointDetail,
            longitude,
            latitude
        } = req.body;

        const checkpoint = await Checkpoint.create({
            checkpointName,
            checkpointDetail,
            longitude,
            latitude
        });

        return res.json({
            msg: "Checkpoint Created Successfully",
            checkpoint
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const getCheckpointList = async (req, res) => {
    try {
        const checkpoints = await Checkpoint.findAll({
            attributes: [
                "id",
                "checkpointName",
                "checkpointDetail",
                "longitude",
                "latitude"
            ]
        });

        return res.json({
            checkpoints
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};


const testEmail = async (req, res) => {
    try {
        await sendEmail(
            "sabreenafayaz08@gmail.com",
            "001 Backend Test Email",
            `
                <h2>Email System Working!</h2>
                <p>This email was sent using Nodemailer.</p>
                <p>Your 001 backend email system is configured correctly.</p>
            `
        );

        res.status(200).json({
            message: "Test email sent successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to send test email",
            error: error.message
        });
    }
};


module.exports = {
    getMe,
    getOrder,
    changeOrderStatus,
    updateCheckpoint,
    getOrderList,
    getUserList,
    changeRate,
    addCheckpoint,
    getCheckpointList,
    testEmail
};