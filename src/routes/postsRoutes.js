const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
} = require("../controllers/postController");

router.get("/", getPosts);
router.post("/", auth, createPost);

router.get("/:id", getPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

router.post("/:id/like", auth, likePost);
router.post("/:id/comments", auth, addComment);

module.exports = router;
