import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@itapp.com" },
    update: {},
    create: {
      email: "admin@itapp.com",
      password: hashedPassword,
      name: "Ionut G.",
      role: "IT Manager",
    },
  });

  console.log("✅ User test creat!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
