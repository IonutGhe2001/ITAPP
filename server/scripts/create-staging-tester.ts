import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { logger } from "../src/lib/logger";

const email = "tester@local.test";
const plainPassword = process.env.STAGING_TESTER_PASSWORD ?? "staging-login";

async function ensureTester() {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "user",
      nume: "Staging",
      prenume: "Tester",
      functie: "QA",
    },
    create: {
      email,
      password: hashedPassword,
      role: "user",
      nume: "Staging",
      prenume: "Tester",
      functie: "QA",
    },
  });

  logger.info("Ensured staging tester user", {
    email,
    role: "user",
  });
}

ensureTester()
  .catch((error) => {
    logger.error("Failed to seed staging tester", { error });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });