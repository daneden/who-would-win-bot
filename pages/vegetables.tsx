import { PrismaClient } from "@prisma/client"
import getLeaderboard from "../utils/getLeaderboard"
import HomePage from "./index"

export default function Vegetables({ leaderboard }) {
  return <HomePage leaderboard={leaderboard} />
}

export async function getStaticProps() {
  const prisma = new PrismaClient()
  const allFighters = await getLeaderboard(prisma)
  const leaderboard = allFighters.filter((fighter) => {
    const regex =
      /(mushroom|potato|carrot|onion|ear of corn|pumpkin|tomato|eggplant|pepper|avocado|cucumber|garlic|leafy green|broccoli|cabbage|cauliflower)/
    return regex.test(fighter.label)
  })

  return {
    props: {
      leaderboard,
    },
    revalidate: 60 * 60 * 8,
  }
}
