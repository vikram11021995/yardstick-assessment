const express = require("express");
const router = express.Router();

const jwtVerifyToken = require("../middleware/auth");
const checkUserRole = require("../middleware/role");
const noteController = require("../controllers/noteController");

router.use(jwtVerifyToken);

router.post("/", checkUserRole(["member"]), noteController.createNote);
router.get("/", checkUserRole(["admin", "member"]), noteController.getNotes);
router.get("/:id", checkUserRole(["admin", "member"]), noteController.getNote);
router.put("/:id", checkUserRole(["member", "admin"]), noteController.updateNote);
router.delete("/:id", checkUserRole(["admin"]), noteController.deleteNote);

module.exports = router;



