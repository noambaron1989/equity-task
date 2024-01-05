// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const employees = []
  const alice = await prisma.employee.upsert({
      where: { email: 'alice@prisma.io' },
      update: {},
      create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      role: 'SWE'
      },
  })

  const bob = await prisma.employee.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
    email: 'bob@prisma.io',
    name: 'Alice',
    role: 'SWE'
    },
  })

  const boss = await prisma.employee.upsert({
    where: { email: 'boss@prisma.io' },
    update: {},
    create: {
    email: 'boss@prisma.io',
    name: 'Alice',
    role: 'STL'
    },
  })

    employees.push(alice, bob, boss)
    console.log({employees})
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
