const express = require("express");
const router = express.Router();

const util = require("../../modules/utils");
const responseMessage = require("../../modules/responseMessage");
const statusCode = require("../../modules/statusCode");
const func = require("./functions");
const usersDB = require("../../modules/usersDB");

router.post("/signup", async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        console.log(" ID 또는 PWD가 입력되지않았습니다.");
        return res
            .status(statusCode.BAD_REQUEST)
            .json(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    if (func.getUserById(id)) {
        console.log("ID가 이미 존재합니다.");

        return res
            .status(statusCode.BAD_REQUEST)
            .json(
                util.fail(statusCode.BAD_REQUEST, responseMessage.ALREADY_ID)
            );
    }

    try {
        const encryptObj = await func.encryptPassword(password);
        const userInfo = {
            id,
            password: encryptObj.key,
            salt: encryptObj.salt
        };

        usersDB.push(userInfo);

        return res
            .status(statusCode.OK)
            .json(
                util.success(
                    statusCode.OK,
                    responseMessage.SIGN_UP_SUCCESS,
                    userInfo.id
                )
            );
    } catch (err) {
        console.log(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.INTERNAL_SERVER_ERROR
                )
            );
    }
});

router.post("/signin", async (req, res) => {
    const { id, password } = req.body; // 1. req.body에서 데이터 가져오기
    if (!id || !password) {
        console.log(" ID 또는 PWD가 입력되지않았습니다.");
        return res
            .status(statusCode.BAD_REQUEST)
            .json(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    if (!func.getUserById(id)) {
        console.log("존재하지 않는 ID입니다.");

        return res
            .status(statusCode.BAD_REQUEST)
            .json(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }

    try {
        const isVerified = await func.verifyPassword(id, password);

        if (isVerified) {
            return res
                .status(statusCode.OK)
                .json(
                    util.success(
                        statusCode.OK,
                        responseMessage.SIGN_IN_SUCCESS,
                        id
                    )
                );
        } else {
            return res
                .status(statusCode.UNAUTHORIZED)
                .json(
                    util.fail(
                        statusCode.UNAUTHORIZED,
                        responseMessage.SIGN_IN_FAIL
                    )
                );
        }
    } catch (err) {
        console.log(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .json(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.INTERNAL_SERVER_ERROR
                )
            );
    }
});

router.get("/", (req, res) => {
    const users = func.getUsers();

    return res
        .status(statusCode.OK)
        .json(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_READ_ALL_SUCCESS,
                users
            )
        );
});

module.exports = router;
