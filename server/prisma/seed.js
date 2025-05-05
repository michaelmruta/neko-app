const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.opportunity.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.customer.deleteMany({});
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

  // Create regular users
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

  for (let i = 0; i < 8; i++) {
    const userPassword = await bcrypt.hash(`user${i + 1}@example.com`, 10);
    const isVerified = ["ACTIVE", "INACTIVE", "SUSPENDED"].includes(
      statuses[i % statuses.length]
    );

    await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: userPassword,
        role: "USER",
        status: statuses[i % statuses.length],
        isVerified: isVerified,
        lastLogin: i < 5 ? new Date(Date.now() - i * 86400000) : null, // Some users have login history
      },
    });
  }

  // Create customers
  const customers = [
    {
      name: "Acme Corporation",
      email: "info@acme.com",
      phone: "(555) 123-4567",
      website: "www.acme.com",
      address: "123 Main St, Anytown, USA",
    },
    {
      name: "Globex Corporation",
      email: "contact@globex.com",
      phone: "(555) 234-5678",
      website: "www.globex.com",
      address: "456 Tech Blvd, Innovation City, USA",
    },
    {
      name: "Initech",
      email: "support@initech.com",
      phone: "(555) 345-6789",
      website: "www.initech.com",
      address: "789 Office Park, Cubicle Town, USA",
    },
    {
      name: "Umbrella Corporation",
      email: "info@umbrella.com",
      phone: "(555) 456-7890",
      website: "www.umbrella.com",
      address: "101 Science Way, Research Heights, USA",
    },
    {
      name: "Stark Industries",
      email: "inquiries@stark.com",
      phone: "(555) 567-8901",
      website: "www.stark.com",
      address: "200 Innovation Drive, Future City, USA",
    },
  ];

  const createdCustomers = [];

  for (const customer of customers) {
    const createdCustomer = await prisma.customer.create({
      data: customer,
    });
    createdCustomers.push(createdCustomer);
  }

  // Create contacts for each customer
  const contacts = [
    {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@acme.com",
      phone: "(555) 111-2222",
      position: "CEO",
      customerId: createdCustomers[0].id,
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@acme.com",
      phone: "(555) 222-3333",
      position: "CTO",
      customerId: createdCustomers[0].id,
    },
    {
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.johnson@globex.com",
      phone: "(555) 333-4444",
      position: "Sales Director",
      customerId: createdCustomers[1].id,
    },
    {
      firstName: "Emily",
      lastName: "Williams",
      email: "emily.williams@initech.com",
      phone: "(555) 444-5555",
      position: "Marketing Manager",
      customerId: createdCustomers[2].id,
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@umbrella.com",
      phone: "(555) 555-6666",
      position: "Research Director",
      customerId: createdCustomers[3].id,
    },
    {
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.davis@stark.com",
      phone: "(555) 666-7777",
      position: "Innovation Lead",
      customerId: createdCustomers[4].id,
    },
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact,
    });
  }

  // Create leads
  const leadSources = [
    "WEBSITE",
    "EMAIL_MARKETING",
    "SOCIAL_MEDIA",
    "PARTNER_REFERRAL",
    "PUBLIC_SEMINARS_WORKSHOPS",
    "OUTBOUND_SALES_CALLS",
    "INBOUNDS_PHONE_CALLS",
    "WEB_DEVELOPMENT",
    "OTHER",
  ];

  const leads = [
    {
      name: "Thomas Anderson",
      email: "t.anderson@matrix.com",
      phone: "(555) 777-8888",
      company: "Matrix Consulting",
      source: leadSources[0],
    },
    {
      name: "Lisa Wong",
      email: "lisa.wong@futurecorp.com",
      phone: "(555) 888-9999",
      company: "Future Corp",
      source: leadSources[1],
    },
    {
      name: "David Martinez",
      email: "d.martinez@cyberdyne.com",
      phone: "(555) 999-0000",
      company: "Cyberdyne Systems",
      source: leadSources[2],
    },
    {
      name: "Rachel Green",
      email: "rachel.green@central.com",
      phone: "(555) 000-1111",
      company: "Central Perk",
      source: leadSources[3],
    },
    {
      name: "Tony Stark",
      email: "tony@avengers.com",
      phone: "(555) 111-2222",
      company: "Avengers Initiative",
      source: leadSources[4],
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({
      data: lead,
    });
  }

  // Create opportunities
  const opportunityStages = [
    "PROSPECTING",
    "QUALIFICATION",
    "NEED_ANALYSIS",
    "VALUE_PROPOSITION",
    "ID_DECISION_MAKER_BUYER",
    "NEGOTIATION_REVIEW",
    "CLOSED_WON",
    "CLOSED_LOST",
  ];

  const opportunities = [
    {
      title: "Enterprise Software Implementation",
      description: "Full-scale ERP implementation for all departments",
      amount: 250000.0,
      stage: opportunityStages[3],
      customerId: createdCustomers[0].id,
    },
    {
      title: "Cloud Migration Project",
      description: "Migrate on-premise infrastructure to cloud",
      amount: 175000.0,
      stage: opportunityStages[5],
      customerId: createdCustomers[1].id,
    },
    {
      title: "Security Audit and Implementation",
      description: "Comprehensive security review and implementation",
      amount: 85000.0,
      stage: opportunityStages[6],
      customerId: createdCustomers[2].id,
    },
    {
      title: "Data Analytics Platform",
      description: "Custom analytics solution for business intelligence",
      amount: 120000.0,
      stage: opportunityStages[2],
      customerId: createdCustomers[3].id,
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile application",
      amount: 95000.0,
      stage: opportunityStages[4],
      customerId: createdCustomers[4].id,
    },
    {
      title: "Website Redesign",
      description: "Complete overhaul of corporate website",
      amount: 45000.0,
      stage: opportunityStages[1],
      customerId: createdCustomers[0].id,
    },
  ];

  for (const opportunity of opportunities) {
    await prisma.opportunity.create({
      data: opportunity,
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
