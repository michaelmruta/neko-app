const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});

  // Reset auto-increment counters back to 1
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Product', 'Opportunity', 'Contact', 'Lead', 'Customer', 'User');`;

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

  // Create products
  const productCategories = [
    "ELECTRONICS",
    "CLOTHING",
    "HOME",
    "OFFICE",
    "SPORTS",
    "BEAUTY",
    "FOOD",
    "OTHER",
  ];

  const products = [
    {
      name: "Laptop Pro X1",
      description: "High-performance laptop with 16GB RAM and 512GB SSD",
      price: 1299.99,
      sku: "TECH-LP-001",
      category: productCategories[0],
      inStock: true,
      imageUrl: "https://example.com/images/laptop-x1.jpg",
    },
    {
      name: "Wireless Headphones",
      description:
        "Noise-cancelling wireless headphones with 20hr battery life",
      price: 199.99,
      sku: "TECH-WH-002",
      category: productCategories[0],
      inStock: true,
      imageUrl: "https://example.com/images/headphones.jpg",
    },
    {
      name: "Office Desk Chair",
      description: "Ergonomic office chair with lumbar support",
      price: 249.99,
      sku: "OFF-CH-001",
      category: productCategories[3],
      inStock: true,
      imageUrl: "https://example.com/images/office-chair.jpg",
    },
    {
      name: "Cotton T-Shirt",
      description: "100% cotton t-shirt, available in multiple colors",
      price: 24.99,
      sku: "CL-TS-001",
      category: productCategories[1],
      inStock: true,
      imageUrl: "https://example.com/images/tshirt.jpg",
    },
    {
      name: "Smart Home Hub",
      description: "Central control for all your smart home devices",
      price: 129.99,
      sku: "HOME-SH-001",
      category: productCategories[2],
      inStock: false,
      imageUrl: "https://example.com/images/smart-hub.jpg",
    },
    {
      name: "Yoga Mat",
      description: "Non-slip yoga mat, perfect for home workouts",
      price: 39.99,
      sku: "SP-YM-001",
      category: productCategories[4],
      inStock: true,
      imageUrl: "https://example.com/images/yoga-mat.jpg",
    },
    {
      name: "Moisturizing Face Cream",
      description: "Hydrating face cream for all skin types",
      price: 22.99,
      sku: "BEAUTY-FC-001",
      category: productCategories[5],
      inStock: true,
      imageUrl: "https://example.com/images/face-cream.jpg",
    },
    {
      name: "Organic Coffee Beans",
      description: "Fair trade organic coffee beans, 1lb bag",
      price: 14.99,
      sku: "FOOD-CB-001",
      category: productCategories[6],
      inStock: true,
      imageUrl: "https://example.com/images/coffee-beans.jpg",
    },
  ];

  const createdProducts = []; // Add this line to create the array

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      // Store the result
      data: product,
    });
    createdProducts.push(createdProduct); // Add the created product to the array
  }

  // Add this to your existing seed.js file, after the product creation section

  // Create inventory items for products
  const inventoryStatuses = [
    "IN_STOCK",
    "LOW_STOCK",
    "OUT_OF_STOCK",
    "ON_ORDER",
    "RESERVED",
  ];

  const locations = [
    "Warehouse A",
    "Warehouse B",
    "Store Front",
    "Distribution Center",
    "Supplier Facility",
  ];

  // First, clear any existing inventory data
  await prisma.inventory.deleteMany({});

  // Reset auto-increment counter for Inventory
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Inventory';`;

  // Create inventory entries for each product
  for (const product of createdProducts) {
    const randomStatus =
      inventoryStatuses[Math.floor(Math.random() * inventoryStatuses.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const quantity =
      randomStatus === "OUT_OF_STOCK"
        ? 0
        : randomStatus === "LOW_STOCK"
        ? Math.floor(Math.random() * 10) + 1
        : Math.floor(Math.random() * 100) + 10;

    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: quantity,
        location: randomLocation,
        status: randomStatus,
        lastUpdated: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 86400000
        ), // Random date within last 30 days
      },
    });
  }

  console.log("Inventory data seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
