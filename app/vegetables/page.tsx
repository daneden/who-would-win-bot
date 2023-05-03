import { PrismaClient } from "@prisma/client"
import getLeaderboard from "../../utils/getLeaderboard"
import styles from "../home.module.css"
import Layout from "../layout"

const prisma = new PrismaClient()

export default async function VegetablesPage() {
  const allFighters = await getLeaderboard(prisma)
  const leaderboard = allFighters.filter((fighter) => {
    const regex =
      /(mushroom|potato|carrot|onion|ear of corn|pumpkin|tomato|eggplant|pepper|avocado|cucumber|garlic|leafy green|broccoli|cabbage|cauliflower)/
    return regex.test(fighter.label)
  })

  return (
    <Layout>
      <div className={styles.tableContainer}>
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
  )
}
