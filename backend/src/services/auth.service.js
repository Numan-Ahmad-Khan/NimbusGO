const bcrypt = require("bcrypt");
const Rider = require("../models/Rider");
const User = require("../models/Users");
const AppError = require("../utils/appError");


const signupUser = async (name, email, password, role) => {

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role
    });

    return createdUser;
};


const loginUser = async (email, password) => {

    const user = await User.findOne({
        where: {
            email
        }
    });

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (!user.isActive) {
        throw new AppError(
            "User deactivated",
            403
        );
    }

    const verification = await bcrypt.compare(
        password,
        user.password
    );

    if (!verification) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    return user;
};


const signupRider = async (
    name,
    email,
    password,
    latitude,
    longitude
) => {

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdRider = await Rider.create({
        name: name,
        email: email,
        password: hashedPassword,
        latitude: latitude,
        longitude: longitude
    });

    return createdRider;
};


const loginRider = async (email, password) => {

    const rider = await Rider.findOne({
        where: {
            email
        }
    });

    if (!rider) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (!rider.isActive) {
        throw new AppError(
            "Rider account deactivated",
            403
        );
    }

    const verification = await bcrypt.compare(
        password,
        rider.password
    );

    if (!verification) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    return rider;
};


module.exports = {
    signupUser,
    loginUser,
    signupRider,
    loginRider
};