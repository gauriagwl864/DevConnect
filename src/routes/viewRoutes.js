const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");

function getUser(req) {
  try {
    return jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

router.get("/", (req, res) => {
  const user = getUser(req);
  res.redirect(user ? "/dashboard" : "/login");
});

router.get("/register", (req, res) => {
  res.render("pages/register", { error: null });
});

router.get("/login", (req, res) => {
  res.render("pages/login", { error: null });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.get("/dashboard", async (req, res, next) => {
  try {
    const user = getUser(req);
    if (!user) return res.redirect("/login");

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const search = req.query.search || "";
    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const currentUser = await User.findById(user.id).select("-password");

    res.render("pages/dashboard", {
      user: currentUser,
      posts,
      search,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/posts/new", (req, res) => {
  const user = getUser(req);
  if (!user) return res.redirect("/login");
  res.render("pages/createPost", { user, error: null });
});

router.get("/posts/:id", async (req, res, next) => {
  try {
    const user = getUser(req);
    const post = await Post.findById(req.params.id)
      .populate("author", "name bio")
      .populate("comments.user", "name");

    if (!post) return res.status(404).render("pages/error", { message: "Post not found" });

    res.render("pages/post", { user, post });
  } catch (err) {
    next(err);
  }
});

router.get("/profile/:id", async (req, res, next) => {
  try {
    const user = getUser(req);
    const profile = await User.findById(req.params.id).select("-password");
    if (!profile) return res.status(404).render("pages/error", { message: "User not found" });

    const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });

    res.render("pages/profile", { user, profile, posts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
