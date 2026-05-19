import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// Middleware: deserialize Article.keywords from JSON string → string[] on reads
prisma.$use(async (params, next) => {
  const result = await next(params);

  if (params.model === "Article") {
    if (
      params.action === "findUnique" ||
      params.action === "findMany" ||
      params.action === "findFirst"
    ) {
      const parse = (obj: any) => {
        if (obj?.keywords && typeof obj.keywords === "string") {
          try { obj.keywords = JSON.parse(obj.keywords); } catch { obj.keywords = []; }
        }
        return obj;
      };
      if (Array.isArray(result)) {
        result.forEach(parse);
      } else if (result) {
        parse(result);
      }
    }
  }

  return result;
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
