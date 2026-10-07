const ApiKey = require("../models/ApiKey");

const {
    compareApiKey
} = require("../utils/apiKey");

const apiKeyAuthentication = async (req, res, next) => {

    try {

        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                message: "API key is required."
            });
        }

        if (!apiKey.startsWith("ng_live_")) {
            return res.status(401).json({
                message: "Invalid API key."
            });
        }

        const keyPrefix = apiKey.substring(0, 16);

        const storedApiKey = await ApiKey.findOne({
            where: {
                keyPrefix
            }
        });

        if (!storedApiKey) {
            return res.status(401).json({
                message: "Invalid API key."
            });
        }

        if (!storedApiKey.isActive) {
            return res.status(401).json({
                message: "API key is inactive."
            });
        }

        if (
            storedApiKey.expiresAt &&
            new Date() > new Date(storedApiKey.expiresAt)
        ) {
            return res.status(401).json({
                message: "API key has expired."
            });
        }

        const isValid = await compareApiKey(
            apiKey,
            storedApiKey.keyHash
        );

        if (!isValid) {
            return res.status(401).json({
                message: "Invalid API key."
            });
        }

        storedApiKey.lastUsedAt = new Date();

        await storedApiKey.save();

        req.apiKey = storedApiKey;

        next();

    } catch (error) {

        next(error);

    }
};

module.exports = apiKeyAuthentication;