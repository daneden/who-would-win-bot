import pkg from "@prisma/client"
const { PrismaClient } = pkg

const prisma = new PrismaClient()

async function main() {
  // await prisma.emoji.createMany({ data: emoji })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
