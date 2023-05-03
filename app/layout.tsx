import { ReactNode } from "react"
import Header from "./components/Header"
import "./global.css"

export const metadata = {
  title: {
    template: "%s | Who Would Win? Bot Leaderboard",
    absolute: "Who Would Win? Bot Leaderboard",
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <main>
        <Header />
        {children}
      </main>
    </html>
  )
}
