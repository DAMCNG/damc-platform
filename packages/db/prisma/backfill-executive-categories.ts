import { PrismaClient, type ExecutiveRole } from "@prisma/client";

const prisma = new PrismaClient();

// Matches the deterministic ids seed.ts creates for these categories -
// run `pnpm db:seed` before this script so the categories already exist.
const ROLE_TO_CATEGORY_ID: Record<ExecutiveRole, string> = {
  PRESIDENT: "exec-cat-president",
  VICE_PRESIDENT: "exec-cat-vice-president",
  SECRETARY: "exec-cat-secretary",
  SOCIAL_SECRETARY: "exec-cat-social-secretary",
  ASSISTANT_SECRETARY: "exec-cat-assistant-secretary",
  TREASURER: "exec-cat-treasurer",
  FINANCIAL_SECRETARY: "exec-cat-financial-secretary",
  ASSISTANT_FINANCIAL_SECRETARY: "exec-cat-assistant-financial-secretary",
  CHIEF_PROVOST: "exec-cat-chief-provost",
  LEGAL_ADVISER: "exec-cat-legal-adviser",
  WELFARE: "exec-cat-welfare",
  PRO: "exec-cat-pro",
  ETHICS_AND_PRIVILEGES_COMMISSION: "exec-cat-ethics",
};

async function main() {
  const positions = await prisma.executivePosition.findMany({
    where: { categoryId: null, role: { not: null } },
  });

  let updated = 0;
  for (const position of positions) {
    const categoryId = position.role ? ROLE_TO_CATEGORY_ID[position.role] : undefined;
    if (!categoryId) {
      console.warn(`No category mapping for role "${position.role}" on position ${position.id}, skipping.`);
      continue;
    }
    await prisma.executivePosition.update({ where: { id: position.id }, data: { categoryId } });
    updated++;
  }

  console.log(`Backfilled ${updated} of ${positions.length} executive position(s) with no category.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
