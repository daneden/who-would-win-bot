export const runtime = "edge"

import { PrismaClient } from "@prisma/client"
import startFight from "../../../utils/startFight"
import tallyFights from "../../../utils/tallyFights"

const prisma = new PrismaClient()

export async function GET() {
  try {
    await tallyFights(prisma)
    await startFight(prisma)
    return new Response("Tallied and started new fight")
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
