import Link from "next/link"
import { FightDetails } from "../../../utils/getLeaderboard"
import styles from "./styles.module.css"

export default function FightOverview({
  fight: { fighter_reports, id, created_at },
}: {
  fight: FightDetails
}) {
  const totalVotes = fighter_reports.reduce((prev, curr) => {
    return prev + curr.votes
  }, 0)

  const maxVotes = fighter_reports.reduce((prev, curr) => {
    return prev > curr.votes ? prev : curr.votes
  }, 0)

  return (
    <>
      <div className={styles.root}>
        <h3>
          <Link href={`https://twitter.com/WhoWouldWinBot/status/${id}`}>
            {created_at}
          </Link>
        </h3>
        <ol>
          {fighter_reports.map((report) => (
            <li
              key={report.fighter.id}
              className={report.votes === maxVotes ? "winner" : "loser"}
            >
              <span
                className={`bg`}
                style={{ width: `${(report.votes / totalVotes) * 100}%` }}
              />
              <span>
                {report.fighter.utf} {report.fighter.shortname}
              </span>{" "}
              <small>{report.votes} votes</small>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
