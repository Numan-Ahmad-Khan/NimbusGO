const redis = require("../config/redis");

const apiKeyRateLimiter = (
    limit,
    windowSeconds
) => {

    return async (req, res, next) => {

        try {

            if (!req.apiKey || !req.apiKey.id) {
                return res.status(500).json({
                    message:
                        "API key authentication required before rate limiting."
                });
            }


            const key =
                `api_rate:${req.apiKey.id}`;


            const current =
                await redis.incr(key);

            if (current === 1) {

                await redis.expire(
                    key,
                    windowSeconds
                );

            }

            if (current > limit) {

                const ttl =
                    await redis.ttl(key);


                return res.status(429).json({

                    message:
                        "Too many requests. Please try again later.",

                    retryAfter:
                        ttl > 0
                            ? ttl
                            : windowSeconds,

                });

            }
            next();


        } catch (error) {

            next(error);

        }

    };

};


module.exports =
    apiKeyRateLimiter;