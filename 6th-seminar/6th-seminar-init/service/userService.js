const crypto = require("crypto");
const { User } = require("../models");
const CustomError = require("../modules/CustomError");

module.exports = {
    emailCheck: async email => {
        try {
            const alreadyEmail = await User.findOne({
                where: {
                    email
                }
            });
            return alreadyEmail;
        } catch (err) {
            throw err;
        }
    },
    signup: async (email, password, userName) => {
        try {
            const salt = crypto.randomBytes(64).toString("base64");
            const hashedPassword = crypto
                .pbkdf2Sync(password, salt, 10000, 64, "sha512")
                .toString("base64");
            const user = await User.create({
                email,
                password: hashedPassword,
                userName,
                salt
            });
            return user;
        } catch (err) {
            throw err;
        }
    },
    signin: async (email, password, salt) => {
        try {
            const inputPassword = crypto
                .pbkdf2Sync(password, salt, 10000, 64, "sha512")
                .toString("base64");
            const user = await User.findOne({
                where: {
                    email,
                    password: inputPassword
                }
            });
            return user;
        } catch (err) {
            throw err;
        }
    },

    getUserInfoById: async id => {
        try {
            const userInfo = await User.findOne({
                where: { id },
                attributes: { exclude: ["password", "salt"] }
            });

            if (!userInfo) {
                throw new CustomError(400, "User Not Found");
            }
            return userInfo;
        } catch (err) {
            throw err;
        }
    },

    saveRefreshToken: async (id, refreshToken) => {
        try {
            const updatedUserId = await User.update(
                {
                    refreshToken
                },
                {
                    where: {
                        id
                    }
                }
            );

            if (!updatedUserId) {
                throw new CustomError(400, "User Not Found");
            }
        } catch (err) {
            throw err;
        }
    }
};
