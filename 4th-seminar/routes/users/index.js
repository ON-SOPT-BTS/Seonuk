const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const util = require("../../modules/utils");
const responseMessage = require("../../modules/responseMessage");
const statusCode = require("../../modules/statusCode");
const { User } = require("../../models");

router.post("/signup", async (req, res) => {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
        console.log("필요한 값이 없습니다!");
        return res
            .status(statusCode.BAD_REQUEST)
            .send(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    try {
        const alreadyEmail = await User.findOne({
            where: {
                email: email
            }
        });

        if (alreadyEmail) {
            console.log("이미 존재하는 이메일 입니다.");
            return res
                .status(statusCode.BAD_REQUEST)
                .send(
                    util.fail(
                        statusCode.BAD_REQUEST,
                        responseMessage.ALREADY_ID
                    )
                );
        }
        //4. salt 생성
        const salt = crypto.randomBytes(64).toString("base64");
        //5. 2차 세미나때 배웠던 pbkdf2 방식으로 (비밀번호 + salt) => 암호화된 password
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 64, "sha512")
            .toString("base64");

        const user = await User.create({
            email,
            password,
            userName,
            salt
        });

        console.log(user);
        return res.status(statusCode.OK).send(
            util.success(statusCode.OK, responseMessage.SIGN_UP_SUCCESS, {
                id: user.id,
                email,
                userName
            })
        );
    } catch (error) {
        console.error(error);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.SIGN_UP_FAIL
                )
            );
    }
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body; // 1. req.body에서 데이터 가져오기

    if (!email || !password) {
        console.log("필요한 값이 없습니다");
        return res
            .status(statusCode.BAD_REQUEST)
            .send(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    try {
        const alreadyEmail = await User.findOne({
            where: {
                email: email
            }
        });

        console.log(alreadyEmail);

        if (!alreadyEmail) {
            console.log("없는 이메일입니다.");
            return res
                .status(statusCode.BAD_REQUEST)
                .send(
                    util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER)
                );
        }

        const { id, userName, salt, password: hashedPassword } = alreadyEmail;
        const inputPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 64, "sha512")
            .toString("base64");

        if (!inputPassword == hashedPassword) {
            console.log("비밀번호가 일치하지않습니다");
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.OK, responseMessage.MISS_MATCH_PW));
        }

        return res.status(statusCode.OK).send(
            util.success(statusCode.OK, responseMessage.SIGN_IN_SUCCESS, {
                id,
                email,
                userName
            })
        );
    } catch (err) {
        console.error(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.SIGN_IN_FAIL
                )
            );
    }
    //2. request data 확인하기, email, password, userName data가 없다면 NullValue 반환
    //3. 존재하는 아이디인지 확인하기. 존재하지 않는 아이디면 NO USER 반환
    //4. 비밀번호 확인하기 - 로그인할 email의 salt를 DB에서 가져와서 사용자가 request로 보낸 password와 암호화를 한후 디비에 저장되어있는 password와 일치하면 true
    // 일치하지 않으면 Miss Match password 반환
    //5. status: 200 ,message: SIGN_IN_SUCCESS, data: id, email, userName 반환
});
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["email", "userName"]
        });
        console.log(users);

        return res
            .status(statusCode.OK)
            .send(
                util.success(
                    statusCode.OK,
                    responseMessage.USER_READ_ALL_SUCCESS,
                    users
                )
            );
    } catch (err) {
        console.error(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.USER_READ_ALL_FAIL
                )
            );
    }
    //1. 모든 사용자 정보 (id, email, userName ) 리스폰스!
    // status: 200, message: READ_USER_ALL_SUCCESS, data: id, email, userName 반환
});
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({
            where: {
                id: id
            },
            attributes: ["id", "email", "userName"]
        });

        if (!user) {
            console.log("존재하지않는 Id입니다");
            return res
                .status(statusCode.BAD_REQUEST)
                .send(
                    util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER)
                );
        }

        return res
            .status(statusCode.OK)
            .send(
                util.success(
                    statusCode.OK,
                    responseMessage.READ_USER_SUCCESS,
                    user
                )
            );
    } catch (err) {
        console.error(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(
                util.fail(
                    statusCode.INTERNAL_SERVER_ERROR,
                    responseMessage.USER_READ_ALL_FAIL
                )
            );
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({
        where: {
            id
        }
    });
    console.log(user);

    if (!user) {
        return res
            .status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }
    const del = await User.destroy({
        where: {
            id
        }
    });

    return res
        .status(statusCode.OK)
        .json(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_DELETE_SUCCESS,
                del
            )
        );
});
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { userName, pwd } = req.body;

    if (!userName || !pwd) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    const user = await User.findOne({
        where: {
            id
        }
    });

    if (!user) {
        return res
            .status(statusCode.BAD_REQUEST)
            .json(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }

    const salt = crypto.randomBytes(64).toString("base64");
    //5. 2차 세미나때 배웠던 pbkdf2 방식으로 (비밀번호 + salt) => 암호화된 password
    const hashedPassword = crypto
        .pbkdf2Sync(pwd, salt, 10000, 64, "sha512")
        .toString("base64");

    const updatedUser = await User.update(
        {
            userName,
            password: hashedPassword,
            salt
        },
        {
            where: {
                id
            }
        }
    );

    return res
        .status(statusCode.OK)
        .json(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_UPDATE_SUCCESS,
                updatedUser
            )
        );
});
module.exports = router;
