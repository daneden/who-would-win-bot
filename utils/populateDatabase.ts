import pkg from "@prisma/client"
import { getCompetitions } from "./twitter"
const { PrismaClient } = pkg

const prisma = new PrismaClient()

async function main() {
  // await prisma.emoji.createMany({ data: emoji })
  const competitions = await getCompetitions()
  const closedCompetitions = competitions.filter(
    (competition) => competition.status === "closed"
  )
  const fights = closedCompetitions.map((competition) => {
    return {
      id: competition.id,
      tallied: true,
    }
  })

  await prisma.fight.createMany({ data: fights, skipDuplicates: true })

  const allEmoji = await prisma.emoji.findMany()

  const fightRecords = closedCompetitions
    .map((competition) => {
      return competition.options
        .map((fighter) => {
          const shortname = fighter.label.split(" ").slice(1).join(" ")
          if (shortname.length === 0) {
            return undefined
          }

          const emoji = allEmoji.find((e) => e.shortname === shortname)
          return {
            fightId: competition.id,
            fighterId: emoji.id,
            votes: fighter.votes,
          }
        })
        .filter((element) => element !== undefined)
    })
    .flat()

  await prisma.fighterReport.createMany({
    data: fightRecords,
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
