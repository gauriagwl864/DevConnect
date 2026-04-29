const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

router.get("/:id", getProfile);
router.put("/:id", auth, updateProfile);

module.exports = router;
