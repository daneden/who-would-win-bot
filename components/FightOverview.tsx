import Link from "next/link"
import { FightDetails } from "../utils/getLeaderboard"

export default function FightOverview({
  fight: { fighterReports, id, createdAt },
}: {
  fight: FightDetails
}) {
  const totalVotes = fighterReports.reduce((prev, curr) => {
    return prev + curr.votes
  }, 0)

  const maxVotes = fighterReports.reduce((prev, curr) => {
    return prev > curr.votes ? prev : curr.votes
  }, 0)

  return (
    <>
      <div>
        <h3>
          <Link href={`https://twitter.com/WhoWouldWinBot/status/${id}`}>
            <a>{createdAt}</a>
          </Link>
        </h3>
        <ol>
          {fighterReports.map((report) => (
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
      <style jsx>{`
        div {
          margin-block: 0.75em;
        }
        ol {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          position: relative;
          padding: 0.25em 0.5em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        li + li {
          margin-top: 0.25em;
        }

        small {
          opacity: 0.75;
        }

        li > *:not(.winner) {
          z-index: 1;
        }

        .bg {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          background-color: rgba(128, 128, 128, 0.15);
          display: block;
          height: 100%;
          z-index: 0;
          border-radius: 0.25em;
        }

        .winner {
          font-weight: 500;
        }

        .winner .bg {
          background-color: rgba(40, 128, 255, 0.3);
        }

        h3 {
          font-size: 0.75em;
          margin: 0;
          font-weight: 400;
        }

        h3 a {
          color: inherit;
        }
      `}</style>
    </>
  )
}
