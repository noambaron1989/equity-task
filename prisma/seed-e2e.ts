// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
    const employees = []
    const companies = []
    const equityGrants = []
    const alice = await prisma.employee.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
        email: 'alice@prisma.io',
        firstName: 'Alice',
        lastName: 'Wonderland',
        residency: 'US',
        role: 'SWE'
        },
    })
  
    const bob = await prisma.employee.upsert({
      where: { email: 'bob@prisma.io' },
      update: {},
      create: {
      email: 'bob@prisma.io',
      firstName: 'Bob',
      lastName: 'Smith',
      residency: 'US',
      role: 'SWE'
      },
    })
  
    const boss = await prisma.employee.upsert({
      where: { email: 'boss@prisma.io' },
      update: {},
      create: {
      email: 'boss@prisma.io',
      firstName: 'Bruce',
      lastName: 'Cooper',
      residency: 'US',
      role: 'STL'
      },
    })
  
    const carta = await prisma.company.upsert({
      where: { name: 'Carte' },
      update: {},
      create: {
        name: 'Carte',
        latestFMVPrice: 10.85,
        lastFundingType: 'EARLY_STAGE_VENTURE',     
        lastFundingDate:  '2024-01-07T00:00:00Z',
        lastFundingAmount:  100000000
      },
    })
    const reddit = await prisma.company.upsert({
      where: { name: 'Reddit' },
      update: {},
      create: {
        name: 'Reddit',
        latestFMVPrice: 4.56,
        lastFundingType: 'LATE_STAGE_VENTURE',     
        lastFundingDate:  '2024-01-07T00:00:00Z',
        lastFundingAmount:  25000000
      },
    })
  
    const stripe = await prisma.company.upsert({
      where: { name: 'Stripe' },
      update: {},
      create: {
        name: 'Stripe',
        latestFMVPrice: 8.45,
        lastFundingType: 'SEED',     
        lastFundingDate:  '2024-01-07T00:00:00Z',
        lastFundingAmount:  80000000
      },
    })
  
    const equityGrantAliceStripe = await prisma.equityGrant.upsert({
      where: {
          id: 1
      },
      update: {},
      create: {
          employeeId: alice.id,
          companyId: stripe.id,
          grantDate: new Date('2024-01-01'),
          grantType: 'ISO',
          exerciseDate: new Date('2025-01-01'),
          deadline: new Date('2026-01-01'),
          sharePrice: 10.2,
          totalNumberOfShares: 1000,
          totalNumberOfVestedShares: 500,
          vestingPeriod: 4
      }
    });
  
      employees.push(alice, bob, boss)
      companies.push(carta, reddit, stripe)
      equityGrants.push(equityGrantAliceStripe)


}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
