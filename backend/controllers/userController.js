const User = require("../models/User");
const Tenant = require("../models/Tenant");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const tenant = await Tenant.findById(user.tenant);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    res.json({
      user,
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
