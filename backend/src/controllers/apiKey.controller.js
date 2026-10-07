const ApiKey = require("../models/ApiKey");
const {
    generateApiKey,
    hashApiKey
} = require("../utils/apiKey");

const createApiKey = async (req, res, next) => {
    try {
        const {
            name,
            expiresAt
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "API key name is required."
            });
        }

        const apiKey = generateApiKey();

        const keyPrefix = apiKey.substring(0, 16);

        const keyHash = await hashApiKey(apiKey);

        const createdApiKey = await ApiKey.create({
            name,
            keyPrefix,
            keyHash,
            expiresAt: expiresAt || null
        });

        return res.status(201).json({
            message: "API key created successfully.",
            apiKey,
            data: {
                id: createdApiKey.id,
                name: createdApiKey.name,
                keyPrefix: createdApiKey.keyPrefix,
                expiresAt: createdApiKey.expiresAt,
                createdAt: createdApiKey.createdAt
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApiKey
};