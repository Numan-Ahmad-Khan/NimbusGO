const otpService = require("../services/otp.service");

const generateOTP = async (req, res, next) => {
    try {
        await otpService.generateAndSendOTP(req.user.userId);

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        next(error);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required"
            });
        }

        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                message: "OTP must be a 6-digit number"
            });
        }

        await otpService.verifyOTP(
            req.user.userId,
            otp
        );

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    generateOTP,
    verifyOTP
};