import { PrismaClient } from "@prisma/client"
import Head from "next/head"
import FightOverview from "../components/FightOverview"
import Layout from "../components/Layout"
import getLeaderboard, {
  EmojiWithVoteCount,
  FightDetails,
  getLatestFights,
} from "../utils/getLeaderboard"

export default function HomePage({
  leaderboard,
  recentFights,
}: {
  leaderboard: EmojiWithVoteCount[]
  recentFights?: FightDetails[]
}) {
  return (
    <>
      <Head>
        <title>Who Would Win? Bot Leaderboard</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥊</text></svg>"
        />
      </Head>
      <Layout>
        {recentFights ? (
          <details>
            <summary>Latest Fight Results</summary>
            {recentFights?.map((fight) => (
              <FightOverview fight={fight} />
            ))}
          </details>
        ) : null}
        <div className="table-container">
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
              {leaderboard.map(
                ({
                  label,
                  wins,
                  losses,
                  ties,
                  winningPercentage,
                  votes,
                  globalRanking,
                  emoji,
                }) => (
                  <tr key={label}>
                    <td>{globalRanking.toString().padStart(4, "0")}</td>
                    <td>
                      {emoji} {label}
                    </td>
                    <td className="tar">{wins}</td>
                    <td className="tar">{losses}</td>
                    <td className="tar">{ties}</td>
                    <td className="tar">
                      {(winningPercentage * 100).toFixed(2)}
                    </td>
                    <td className="tar">{votes}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </Layout>
      <style jsx>{`
        .table-container {
          width: 100%;
          overflow-x: scroll;
          position: relative;
        }

        table {
          width: var(--page-width);
        }

        details {
          padding: 0.5em 0.75em;
          border-radius: 0.25em;
          background-color: rgba(128, 128, 128, 0.1);
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const prisma = new PrismaClient()
  const leaderboard = await getLeaderboard(prisma)
  const recentFights = await getLatestFights(prisma)

  return {
    props: { leaderboard, recentFights },
    // Refresh at most every 8hrs, which is as often as new competitions happen
    // and are recorded
    revalidate: 60 * 60 * 8,
  }
}
