const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const tenant = req.user.tenant;

    if (tenant.plan === "free") {
      const count = await Note.countDocuments({ tenant: tenant._id });
      if (count >= 3) {
        return res.status(403).json({ error: "Free plan limit reached" });
      }
    }

    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      tenant: tenant._id,
      createdBy: req.user._id,
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenant._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getNote = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    tenant: req.user.tenant._id,
  });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenant: req.user.tenant._id },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    tenant: req.user.tenant._id,
  });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};
