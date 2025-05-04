const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash("admin@example.com", 10);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      isVerified: true,
      lastLogin: new Date(),
    },
  });

  // Create moderator user
  const modPassword = await bcrypt.hash("moderator@example.com", 10);
  await prisma.user.create({
    data: {
      name: "Moderator User",
      email: "moderator@example.com",
      password: modPassword,
      role: "MODERATOR",
      status: "ACTIVE",
      isVerified: true,
      lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    },
  });

  // Create 8 regular users with different statuses
  const statuses = [
    "ACTIVE",
    "ACTIVE",
    "ACTIVE",
    "INACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "PENDING",
    "PENDING",
  ];

  for (let i = 0; i < 28; i++) {
    const userPassword = await bcrypt.hash(`user${i + 1}@example.com`, 10);
    const isVerified = ["ACTIVE", "INACTIVE", "SUSPENDED"].includes(
      statuses[i]
    );

    await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: userPassword,
        role: "USER",
        status: statuses[i],
        isVerified: isVerified,
        lastLogin: i < 5 ? new Date(Date.now() - i * 86400000) : null, // Some users have login history
      },
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
