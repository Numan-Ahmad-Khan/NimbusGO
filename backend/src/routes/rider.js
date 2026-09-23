const express = require("express");

const authorization = require("../middleware/authorization");
const authentication = require("../middleware/authentication");

const riderController = require("../controllers/rider.controller");

const router = express.Router();

router.get(
    "/rider/me",
    authentication,
    authorization("RIDER"),
    riderController.getMe
);

router.patch(
    "/rider/update_order",
    authentication,
    authorization("RIDER"),
    riderController.updateOrder
);
router.patch(
    "/rider/location",
    authentication,
    authorization("RIDER"),
    riderController.updateLocation
);
router.get(
    "/rider/nearby-orders",
    authentication,
    authorization("RIDER"),
    riderController.getNearbyOrders
);
module.exports = router;