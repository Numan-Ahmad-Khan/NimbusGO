const express = require("express");
const apiKeyAuthentication =
    require("../middleware/apiKeyAuthentication");

const apiKeyRateLimiter =
    require("../middleware/apiKeyRateLimiter");

const publicTrackingController =
    require("../controllers/publicTracking.controller");


const router = express.Router();


router.get(
    "/api/v1/tracking/:orderId",
    apiKeyAuthentication,
    apiKeyRateLimiter(60, 60),
    publicTrackingController.trackOrderPublic
);



module.exports = router;