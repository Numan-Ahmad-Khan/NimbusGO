const bcrypt = require("bcrypt");
const User = require("../models/Users");
const Otp = require("../models/Otp");

const { generateOTP } = require("../utils/generateOTP");
const { sendEmail } = require("./email.services");

const generateAndSendOTP = async (userId) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.isVerified) {
        const error = new Error("User is already verified");
        error.statusCode = 400;
        throw error;
    }

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    // Debug purpose
    console.log(`OTP: ${otp}`);

    await sendEmail(
        user.email,
        "Your FastLy Verification OTP",
        `
            <h2>Email Verification</h2>

            <p>Hello ${user.name},</p>

            <p>Your verification OTP is:</p>

            <h1>${otp}</h1>

            <p>
                This OTP is valid for <strong>5 minutes</strong>.
            </p>

            <p>
                If you did not request this OTP,
                you can safely ignore this email.
            </p>

            <br>

            <p>
                Thank you,<br>
                FastLy
            </p>
        `
    );

    // Remove previous OTP only after email is successfully sent
    await Otp.destroy({
        where: {
            userId: user.id
        }
    });

    await Otp.create({
        userId: user.id,
        otpHash: otpHash,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        otpAttempts: 0
    });
};

const verifyOTP = async (userId, enteredOTP) => {
    const user = await User.findOne({
        where: {
            id: userId
        }
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.isVerified) {
        const error = new Error("User is already verified");
        error.statusCode = 400;
        throw error;
    }

    const otpRecord = await Otp.findOne({
        where: {
            userId: user.id
        }
    });

    if (!otpRecord) {
        const error = new Error("OTP not found");
        error.statusCode = 400;
        throw error;
    }

    if (new Date() > otpRecord.otpExpiresAt) {
        await otpRecord.destroy();

        const error = new Error("OTP has expired");
        error.statusCode = 400;
        throw error;
    }

    if (otpRecord.otpAttempts >= 5) {
        await otpRecord.destroy();

        const error = new Error("Too many incorrect attempts. Please request a new OTP.");
        error.statusCode = 429;
        throw error;
    }

    const isValid = await bcrypt.compare(
        enteredOTP,
        otpRecord.otpHash
    );

    if (!isValid) {
        otpRecord.otpAttempts += 1;
        await otpRecord.save();

        const error = new Error("Invalid OTP");
        error.statusCode = 400;
        throw error;
    }

    user.isVerified = true;
    await user.save();

    await otpRecord.destroy();

    return {
        message: "OTP verified successfully"
    };
};

module.exports = {
    generateAndSendOTP,
    verifyOTP
};