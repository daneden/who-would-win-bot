import pkg from "@prisma/client"
import { postPoll } from "./twitter"

const { PrismaClient } = pkg

const prisma = new PrismaClient()

const pickRandom = <T>(set: T[]): T =>
  set[Math.floor(Math.random() * set.length)]

async function startFight() {
  const allEmoji = await prisma.emoji.findMany()

  let fighterA = pickRandom(allEmoji)
  let fighterB = fighterA

  while (fighterB.shortname == fighterA.shortname) {
    fighterB = pickRandom(allEmoji)
  }

  await postPoll({ fighters: [fighterA, fighterB] })
    .then(async ({ data: { id } }) => {
      await prisma.fight.create({ data: { id, tallied: false } })
    })
    .catch((e) => {
      throw e
    })
}

startFight().finally(async () => {
  await prisma.$disconnect()
})
