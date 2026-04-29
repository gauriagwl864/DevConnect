const User = require("../models/user");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id)
      return res.status(403).json({ error: "Not allowed" });

    const { name, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};
