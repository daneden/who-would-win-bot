import { FightDetails } from "../utils/getLeaderboard"

export default function FightOverview({
  fight: { fighterReports, id },
}: {
  fight: FightDetails
}) {
  const maxVote = fighterReports.reduce((prev, curr) => {
    return prev > curr.votes ? prev : curr.votes
  }, 0)

  return (
    <>
      <ul>
        {fighterReports.map((report) => (
          <li
            key={report.fighter.id}
            className={report.votes === maxVote ? "winner" : "loser"}
          >
            <span
              className={`bg`}
              style={{ width: `${(report.votes / maxVote) * 100}%` }}
            />
            <span>
              {report.fighter.utf} {report.fighter.shortname}
            </span>{" "}
            <small>{report.votes} votes</small>
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          list-style: none;
          padding: 0;
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
          background-color: rgba(128, 128, 128, 0.2);
          display: block;
          height: 100%;
          z-index: 0;
          border-radius: 0.25em;
        }

        .winner {
          color: white;
          font-weight: 500;
        }

        .winner .bg {
          background-color: dodgerblue;
        }
      `}</style>
    </>
  )
}
