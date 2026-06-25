import { Prisma } from "@prisma/client";

export function isDatabaseUnavailable(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001")
  );
}

export const DB_UNAVAILABLE_MESSAGE =
  "Database is unavailable. Start PostgreSQL (docker compose up -d) and run npx prisma migrate dev.";
