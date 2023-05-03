import { PrismaClient } from "@prisma/client"
import { getResultsForFight } from "./twitter"

export default async function tallyFights(prisma: PrismaClient) {
  const allEmoji = await prisma.emoji.findMany()

  const twentyFourHoursAgo = new Date(Date.now() - 864e5)
  const fightsToTally = await prisma.fight.findMany({
    where: { tallied: false, created_at: { lte: twentyFourHoursAgo } },
  })

  const reports = fightsToTally.map(async (fight) => {
    const results = await getResultsForFight(fight.id)
    const resultsAsFighterReports = results.map((result) => {
      const shortname = result.label.split(" ").slice(1).join(" ").trim()

      const emoji = allEmoji.find((candidate) => {
        return candidate.shortname === shortname
      })

      return {
        emoji_id: emoji.id,
        votes: result.votes,
        fight_id: fight.id,
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
      fighter_reports: resultsAsFighterReports,
      victor_id: victor?.emoji_id,
    }
  })

  reports.forEach(async (_report) => {
    const report = await _report
    await prisma.fight.update({
      where: { id: report.id },
      data: { victor_id: report.victor_id, tallied: true },
    })
    await prisma.fighterReport.createMany({ data: report.fighter_reports })
  })
}
