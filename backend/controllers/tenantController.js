const Tenant = require("../models/Tenant");

exports.upgradeTenant = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    tenant.plan = "pro";
    await tenant.save();

    res.json({ message: "Tenant upgraded to Pro", tenant });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
