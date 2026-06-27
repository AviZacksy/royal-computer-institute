/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE _prisma_migrations SET migration_name = '20260626120000_question_bank_refactor' WHERE migration_name = '20260624112325_question_bank_refactor'`);
  console.log('Migration name updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
