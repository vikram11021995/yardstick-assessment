const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
        title: { type: String, required: true },
        content: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
