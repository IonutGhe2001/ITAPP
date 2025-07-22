import { prisma } from "@lib/prisma";
import bcrypt from 'bcrypt';



async function main() {
  const email = 'ionut.gheba@creativemed.ro';

  // Șterge utilizatorul dacă deja există
  await prisma.user.deleteMany({
    where: { email }
  });

  const hashedPassword = await bcrypt.hash('parola123', 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nume: 'Ionut',
      prenume: 'Gheba',
      functie: 'IT Manager',
      role: 'admin',
      telefon: '0756540039',
      profilePicture: null,
    },
  });

  console.log('✅ User seed creat cu succes (ionut.gheba@creativemed.ro / parola123)');
}

main()
  .catch((e) => {
    console.error('❌ Eroare la seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
