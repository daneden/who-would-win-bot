import { Emoji, PrismaClient } from "@prisma/client"

export interface EmojiWithVoteCount {
  emoji: string
  label: string
  wins: number
  losses: number
  votes: number
  ties: number
  gamesPlayed: number
  winningPercentage: number
  globalRanking: number
}

export interface FightDetails {
  fighterReports: {
    votes: number
    fighter: Emoji
  }[]
  id: string
  victor: Emoji
}

const baseEmojiWithVoteCount: Omit<EmojiWithVoteCount, "label" | "emoji"> = {
  wins: 0,
  losses: 0,
  gamesPlayed: 0,
  winningPercentage: 0,
  votes: 0,
  ties: 0,
  globalRanking: 0,
}

export default async function getLeaderboard(prisma: PrismaClient) {
  const competitions = await prisma.fight.findMany({
    select: {
      fighterReports: { select: { fighter: true, votes: true } },
      id: true,
      victor: true,
    },
    where: {
      tallied: true,
    },
  })

  const leaderboard: EmojiWithVoteCount[] = Object.values(
    competitions.reduce<{ [key: string]: EmojiWithVoteCount }>(
      (leaderboard, poll) => {
        const [winner, loser] = poll.fighterReports.sort(
          (a, b) => b.votes - a.votes
        )

        if (!leaderboard.hasOwnProperty(winner.fighter.shortname)) {
          leaderboard[winner.fighter.shortname] = {
            label: winner.fighter.shortname,
            emoji: winner.fighter.utf,
            ...baseEmojiWithVoteCount,
          }
        }

        if (!leaderboard.hasOwnProperty(loser.fighter.shortname)) {
          leaderboard[loser.fighter.shortname] = {
            label: loser.fighter.shortname,
            emoji: loser.fighter.utf,
            ...baseEmojiWithVoteCount,
          }
        }

        leaderboard[winner.fighter.shortname].votes += winner.votes
        leaderboard[loser.fighter.shortname].votes += loser.votes

        leaderboard[winner.fighter.shortname].gamesPlayed += 1
        leaderboard[loser.fighter.shortname].gamesPlayed += 1

        if (winner.votes === loser.votes) {
          leaderboard[winner.fighter.shortname].ties += 1
          leaderboard[loser.fighter.shortname].ties += 1
        } else {
          leaderboard[winner.fighter.shortname].wins += 1
          leaderboard[loser.fighter.shortname].losses += 1
        }

        return leaderboard
      },
      {}
    )
  )
    .map((fighter) => {
      const { wins, ties } = fighter
      fighter.winningPercentage = (2 * wins + ties) / (2 * competitions.length)

      return fighter
    })
    .sort((a, b) => b.winningPercentage - a.winningPercentage)
    .map((fighter, index) => {
      return {
        ...fighter,
        globalRanking: index + 1,
      }
    })

  return leaderboard
}

export async function getLatestFights(
  prisma: PrismaClient,
  limit: number = 3
): Promise<FightDetails[]> {
  const competitions = await prisma.fight.findMany({
    select: {
      fighterReports: {
        select: { fighter: true, votes: true },
        orderBy: { votes: "desc" },
      },
      id: true,
      victor: true,
    },
    where: {
      tallied: true,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })

  return competitions
}
