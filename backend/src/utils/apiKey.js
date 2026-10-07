const crypto = require("crypto");
const bcrypt = require("bcrypt");

function generateApiKey() {
    const randomSecret = crypto.randomBytes(32).toString("hex");

    const apiKey = `ng_live_${randomSecret}`;

    return apiKey;
}

async function hashApiKey(apiKey) {
    return await bcrypt.hash(apiKey, 12);
}

async function compareApiKey(apiKey, hashedApiKey) {
    return await bcrypt.compare(apiKey, hashedApiKey);
}

module.exports = {
    generateApiKey,
    hashApiKey,
    compareApiKey
};