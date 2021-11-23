# 🥊 Who Would Win Bot

Who Would Win Bot is a [Twitter bot](https://twitter.com/WhoWouldWinBot) that pits emoji against each other in Twitter polls to let the public decide: who would win in a fight?

## How it works

1. Every eight hours, two emoji are picked at random from a table of 1200+ competitors
2. The bot posts a Twitter poll that expires after 24hrs
3. People cast their votes
4. After 24hrs, the votes are tallied and results posted to [the leaderboard](https://who-would-win.vercel.app)

## Tech Stack

- Twitter API v2
- Planetscale and Prisma for storing fight results
- Next.js and Vercel for the leaderboard website
- GitHub Actions for scheduled jobs like posting fights and tallying results
