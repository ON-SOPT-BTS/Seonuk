const express = require("express");
const router = express.Router();
const userController = require("../../controller/userController");
const authUtils = require("../../middlewares/authUtil");

router.get("/refresh", userController.refresh);
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/", userController.readAll);
router.get("/:id", userController.readOne);

module.exports = router;
