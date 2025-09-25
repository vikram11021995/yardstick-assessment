const mongoose = require("mongoose");
const User = require("./models/User");
const Tenant = require("./models/Tenant");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear old data
  await User.deleteMany({});
  await Tenant.deleteMany({});

  const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "free" });
  const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "free" });

  // Create users
  await User.create([
    { email: "admin@acme.test", password: "password", role: "admin", tenant: acme._id },
    { email: "user@acme.test", password: "password", role: "member", tenant: acme._id },
    { email: "admin@globex.test", password: "password", role: "admin", tenant: globex._id },
    { email: "user@globex.test", password: "password", role: "member", tenant: globex._id }
  ]);

  console.log("Database seeded!");
  mongoose.disconnect();
}

seed();
