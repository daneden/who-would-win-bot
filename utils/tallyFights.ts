import pkg from "@prisma/client"
import { getResultsForFight } from "./twitter"
const { PrismaClient } = pkg

const prisma = new PrismaClient()

async function tallyFights() {
  const allEmoji = await prisma.emoji.findMany()

  const twentyFourHoursAgo = new Date(Date.now() - 864e5)
  const fightsToTally = await prisma.fight.findMany({
    where: { tallied: false, createdAt: { lte: twentyFourHoursAgo } },
  })

  const reports = fightsToTally.map(async (fight) => {
    const results = await getResultsForFight(fight.id)
    const resultsAsFighterReports = results.map((result) => {
      const shortname = result.label.split(" ").slice(1).join(" ").trim()

      const emoji = allEmoji.find((candidate) => {
        return candidate.shortname === shortname
      })

      return {
        fighterId: emoji.id,
        votes: result.votes,
        fightId: fight.id,
      }
    })

    const victor = resultsAsFighterReports.reduce((winner, current) => {
      if (winner?.votes === current.votes) {
        return null
      } else {
        return winner?.votes > current.votes ? winner : current
      }
    }, null)

    return {
      id: fight.id,
      fighterReports: resultsAsFighterReports,
      victorId: victor?.fighterId,
    }
  })

  reports.forEach(async (_report) => {
    const report = await _report
    await prisma.fight.update({
      where: { id: report.id },
      data: { victorId: report.victorId, tallied: true },
    })
    await prisma.fighterReport.createMany({ data: report.fighterReports })
  })
}

tallyFights()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
