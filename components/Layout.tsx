import Header from "./Header"

export default function Layout({ children }) {
  return (
    <>
      <main>
        <Header />
        {children}
      </main>
      <style jsx global>{`
        @import url("https://rsms.me/inter/inter.css");

        :root {
          --wash-color: #f2f2f2;
          --card-wash-color: #fff;
          --text-color: #111;
          --page-width: 32rem;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --wash-color: #000;
            --card-wash-color: #222;
            --text-color: #fff;
          }
        }

        html {
          font: 125%/1.5 "Inter", system-ui, -apple-system, sans-serif;
          font-feature-settings: "ss02" 1, "zero" 1;
          color: var(--text-color);
          background-color: var(--wash-color);
        }

        main {
          margin: 0 auto;
          max-width: var(--page-width);
          padding-bottom: 2rem;
        }

        table {
          border-collapse: collapse;
          font-size: 0.875em;
          width: 100%;
          font-variant-numeric: tabular-nums;
        }

        thead tr {
          position: sticky;
          top: 0;
          background-color: var(--wash-color);
          border-bottom: 2px solid;
          z-index: 1;
          filter: drop-shadow(0 2px 0 var(--text-color));
          padding-top: 1rem;
        }

        tbody tr:first-child {
          font-weight: 500;
          background-color: #ffff0022;
        }

        td,
        th {
          padding: 0.25em 0.75em;
        }

        th {
          padding-top: 1rem;
          font-size: 0.75em;
        }

        td {
          border-bottom: 1px solid rgba(128, 128, 128, 0.3);
        }

        tbody tr:hover {
          background-color: rgba(128, 128, 128, 0.1);
        }

        a {
          color: red;
        }

        th {
          text-align: left;
        }

        abbr {
          text-decoration: underline;
          text-decoration-style: dashed;
          cursor: help;
        }

        .tar {
          text-align: right;
        }

        .tal {
          text-align: left;
        }

        .tac {
          text-align: center;
        }
      `}</style>
    </>
  )
}
