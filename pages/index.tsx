import { PrismaClient } from "@prisma/client"
import Head from "next/head"
import Link from "next/link"
const prisma = new PrismaClient()

interface EmojiWithVoteCount {
  emoji: string
  label: string
  wins: number
  losses: number
  votes: number
  ties: number
  gamesPlayed: number
  winningPercentage: number
}

const baseEmojiWithVoteCount: Omit<EmojiWithVoteCount, "label" | "emoji"> = {
  wins: 0,
  losses: 0,
  gamesPlayed: 0,
  winningPercentage: 0,
  votes: 0,
  ties: 0,
}

export default function HomePage({
  leaderboard,
}: {
  leaderboard: EmojiWithVoteCount[]
}) {
  console.log(leaderboard)
  return (
    <>
      <Head>
        <title>Who Would Win? Bot Leaderboard</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥊</text></svg>"
        />
      </Head>
      <main>
        <header>
          <h1>Who Would Win?</h1>
          <p className="subheading">Competition Leaderboards</p>
        </header>
        <p>
          The{" "}
          <Link href="https://twitter.com/whowouldwinbot">
            <a>Who Would Win? bot</a>
          </Link>{" "}
          is a Twitter bot that posts daily polls pitting emoji head-to-head to
          let people vote on which one would win in a fight.
        </p>
        <p>
          Leaderboards are updated every 8 hours, as often as new competitions
          begin.
        </p>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Emoji</th>
              <th className="tar">Wins</th>
              <th className="tar">Losses</th>
              <th className="tar">Ties</th>
              <th className="tar">
                <abbr title="Winning percentage is calculated as the percentage of all games played won by a given emoji">
                  Win %
                </abbr>
              </th>
              <th className="tar">
                <abbr title="The total number of votes per emoji across all games">
                  Votes
                </abbr>
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((competitor, index) => (
              <tr key={competitor.label}>
                <td>{(index + 1).toString().padStart(4, "0")}</td>
                <td>
                  {competitor.emoji} {competitor.label}
                </td>
                <td className="tar">{competitor.wins}</td>
                <td className="tar">{competitor.losses}</td>
                <td className="tar">{competitor.ties}</td>
                <td className="tar">
                  {(competitor.winningPercentage * 100).toFixed(2)}
                </td>
                <td className="tar">{competitor.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <style jsx>{`
        main {
          margin: 0 auto;
          max-width: 32rem;
        }

        header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1.5rem 0;
        }

        h1 {
          margin: 0;
          padding: 0;
          line-height: 1;
        }

        .subheading {
          color: #888;
        }

        table {
          border-collapse: collapse;
          font-size: 0.875em;
          width: 100%;
          font-variant-numeric: tabular-nums;
        }

        thead tr {
          position: sticky;
          top: 0;
          background-color: var(--wash-color);
          border-bottom: 2px solid;
          z-index: 1;
          filter: drop-shadow(0 2px 0 var(--text-color));
          padding-top: 1rem;
        }

        tbody tr:first-child {
          font-weight: 500;
          background-color: #ffff0022;
        }

        td,
        th {
          padding: 0.25em 0.75em;
        }

        th {
          padding-top: 1rem;
          font-size: 0.75em;
        }

        td {
          border-bottom: 1px solid rgba(128, 128, 128, 0.3);
        }

        tbody tr:hover {
          background-color: rgba(128, 128, 128, 0.1);
        }
      `}</style>
      <style jsx global>{`
        @import url("https://rsms.me/inter/inter.css");

        :root {
          --wash-color: #f2f2f2;
          --card-wash-color: #fff;
          --text-color: #111;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --wash-color: #000;
            --card-wash-color: #222;
            --text-color: #fff;
          }
        }

        html {
          font: 125%/1.5 "Inter", system-ui, -apple-system, sans-serif;
          font-feature-settings: "ss02" 1, "zero" 1;
          color: var(--text-color);
          background-color: var(--wash-color);
        }

        a {
          color: red;
        }

        th {
          text-align: left;
        }

        abbr {
          text-decoration: underline;
          text-decoration-style: dashed;
          cursor: help;
        }

        .tar {
          text-align: right;
        }

        .tal {
          text-align: left;
        }

        .tac {
          text-align: center;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
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

  return {
    props: { leaderboard },
    // Refresh at most every 8hrs, which is as often as new competitions happen
    // and are recorded
    revalidate: 60 * 60 * 8,
  }
}
