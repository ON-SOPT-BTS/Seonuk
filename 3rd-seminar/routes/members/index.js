const express = require("express");
const router = express.Router();
const util = require("../../modules/utils");
const responseMessage = require("../../modules/responseMessage");
const statusCode = require("../../modules/statusCode");
const membersDB = require("../../modules/members");
/** 멤버를 생성 */
router.post("/", (req, res) => {
    const { name, part, age } = req.body;
    const idx = membersDB[membersDB.length - 1].idx + 1;

    if (!name || !part || !age) {
        console.log("필요한 값이 없습니다!");

        return res
            .status(statusCode.BAD_REQUEST)
            .send(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    membersDB.push({
        idx,
        name,
        part,
        age
    });

    return res
        .status(statusCode.CREATED)
        .send(
            util.success(
                statusCode.CREATED,
                responseMessage.MEMBER_CREATE_SUCCESS,
                membersDB
            )
        );
});
/** 모든 멤버 조회 */
router.get("/", (req, res) => {});
/** idx 값으로 특정 멤버 조회 */
router.get("/:idx", (req, res) => {
    const idx = req.params.idx;
    const member = membersDB.find(member => member.idx == idx);

    if (!member) {
        return res
            .status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }

    return res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_READ_SUCCESS,
                member
            )
        );
});
/** idx값으로 특정 멤버 삭제 */
router.delete("/:idx", (req, res) => {
    const idx = req.params.idx;

    const member = membersDB.filter(member => member.idx == idx);

    if (member.length == 0) {
        console.log("idx가 유효하지않습니다.");
        return res
            .status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }

    const filteredMembersDB = membersDB.filter(member => member.idx != idx);

    return res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_DELETE_SUCCESS,
                filteredMembersDB
            )
        );
});
/** idx값으로 특정 멤버 정보 수정 */
router.put("/:idx", (req, res) => {
    const { idx } = req.params;
    const { name, part, age } = req.body;

    if (!name || !part || !age) {
        console.log("필요한 값이 없습니다!");

        return res
            .status(statusCode.BAD_REQUEST)
            .send(
                util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE)
            );
    }

    const memberIdx = membersDB.findIndex(member => member.idx == idx);

    if (memberIdx == -1) {
        console.log("idx가 유효하지않습니다.");
        return res
            .status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NO_USER));
    }

    membersDB[memberIdx] = {
        idx: parseInt(memberIdx),
        name,
        part,
        age
    };

    return res
        .status(statusCode.OK)
        .send(
            util.success(
                statusCode.OK,
                responseMessage.MEMBER_UPDATE_SUCCESS,
                membersDB
            )
        );
});
module.exports = router;
