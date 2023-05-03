import Link from "next/link"
import styles from "./styles.module.css"

export default function Header() {
  return (
    <div className={styles.root}>
      <header>
        <h1>Who Would Win?</h1>
        <p className="subheading">Competition Leaderboards</p>
      </header>
      <p>
        The{" "}
        <Link href="https://twitter.com/whowouldwinbot">
          Who Would Win? bot
        </Link>{" "}
        is a Twitter bot that posts daily polls pitting emoji head-to-head to
        let people vote on which one would win in a fight.
      </p>
      <p>
        Leaderboards are updated every 8 hours, as often as new competitions
        begin.
      </p>
    </div>
  )
}
