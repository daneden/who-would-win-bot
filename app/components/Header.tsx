import Link from "next/link"

export default function Header() {
  return <>
    <header>
      <h1>Who Would Win?</h1>
      <p className="subheading">Competition Leaderboards</p>
    </header>
    <p>
      The{" "}
      <Link href="https://twitter.com/whowouldwinbot" legacyBehavior>
        <a>Who Would Win? bot</a>
      </Link>{" "}
      is a Twitter bot that posts daily polls pitting emoji head-to-head to
      let people vote on which one would win in a fight.
    </p>
    <p>
      Leaderboards are updated every 8 hours, as often as new competitions
      begin.
    </p>
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
    `}</style>
  </>;
}
