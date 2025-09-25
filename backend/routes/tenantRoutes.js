const express = require("express");
const router = express.Router();

const jwtVerifyToken = require("../middleware/auth");
const checkUserRole = require("../middleware/role");
const { upgradeTenant } = require("../controllers/tenantController");

router.post("/:slug/upgrade", jwtVerifyToken, checkUserRole(["admin"]), upgradeTenant);

module.exports = router;


