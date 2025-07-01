import { prisma } from "./config/db";
import bcrypt from "bcrypt";

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("test1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@itapp.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin"
    }
  });

  console.log("Admin creat:", admin);
}

createAdmin()
  .catch(console.error)
  .finally(() => process.exit());
