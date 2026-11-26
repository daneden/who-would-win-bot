export const dynamic = "force-dynamic"

import { PrismaClient } from "@prisma/client"
import startFight from "../../../utils/startFight"
import tallyFights from "../../../utils/tallyFights"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET

  // Without the `!secret` guard, an unset secret would accept the literal
  // header "Bearer undefined".
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    await tallyFights(prisma)
    await startFight(prisma)
    return new Response("Tallied and started new fight")
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
