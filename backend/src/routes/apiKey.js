const express = require("express");

const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const apiKeyController = require("../controllers/apiKey.controller");

const router = express.Router();

router.post(
    "/admin/api-keys",
    authentication,
    authorization("ADMIN"),
    apiKeyController.createApiKey
);

module.exports = router;