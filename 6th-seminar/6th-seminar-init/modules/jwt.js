const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { secretKey, options, refreshOptions } = require("../config/secretKey");

const CustomError = require("../modules/CustomError");
const userService = require("../service/userService");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async user => {
        try {
            const payload = {
                id: user.id,
                name: user.name
            };

            const result = {
                accessToken: jwt.sign(payload, secretKey, options),
                refreshToken: jwt.sign(payload, secretKey, refreshOptions)
            };

            await userService.saveRefreshToken(user.id, result.refreshToken);

            return result;
        } catch (err) {
            throw err;
        }
    },
    verify: async token => {
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.log("expired token");
                return TOKEN_EXPIRED;
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.log("invalid token");
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            }
        }
    },
    refreshAccessToken: async refreshToken => {
        try {
            const result = await jwt.verify(refreshToken, secretKey);
            const userInfo = await userService.getUserInfoById(result.id);

            if (refreshToken !== userInfo.refreshToken) {
                throw new CustomError(400, "Invalid token");
            }

            const accessToken = await jwt.sign(
                {
                    id: userInfo.id,
                    name: userInfo.userName
                },
                secretKey,
                options
            );

            return accessToken;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new CustomError(400, "token is expired");
            } else if (err instanceof jwt.JsonWebTokenError) {
                throw new CustomError(400, "token is invalid");
            } else {
                throw err;
            }
        }
    }
};
