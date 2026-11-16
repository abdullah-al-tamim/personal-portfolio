import Image from "next/image";
import styles from "./PortfolioMarks.module.css";

const paths = {
  research: "M9 3h6 M10 3v6l-6 10q-1 2 2 2h12q3 0 2-2l-6-10V3 M8 15h8",
  projects: "M3 7V5h7l2 2h9v13H3z",
  about: "M16 7a4 4 0 1 1-8 0 4 4 0 1 1 8 0 M4 21a8 8 0 0 1 16 0",
  contact: "M3 5h18v14H3z M3 6l9 7 9-7",
  award: "M17 8a5 5 0 1 1-10 0 5 5 0 1 1 10 0 M9 13l-2 8 5-3 5 3-2-8",
  paper: "M5 2h10l4 4v16H5z M14 2v5h5 M8 11h8 M8 15h8",
  teach: "M3 3h18v13H3z M12 16v5 M8 21l4-5 4 5 M6 11l3-3 3 2 4-4",
  chart: "M3 3v17h18 M7 16v-4 M12 16V8 M17 16V5",
  database: "M20 6c0 4-16 4-16 0s16-4 16 0z M4 6v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0",
  workflow: "M3 3h6v6H3z M15 15h6v6h-6z M6 9v9h9",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 1 1 20 0 M12 6v6l4 2",
  ledger: "M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h3",

  work: "M3 8h18v12H3z M8 8V5h8v3 M3 12q9 5 18 0",
  study: "m2 9 10-5 10 5-10 5z M6 11v6q6 5 12 0v-6 M22 9v7",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z M14 10a2 2 0 1 1-4 0 2 2 0 1 1 4 0",
  signal: "M2 12h5l3-8 4 16 3-8h5",
  copy: "M9 8h11v13H9z M6 16H4V3h11v2",
};

export function Icon({ name }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function OrganizationMark({ file }) {
  return (
    <span aria-hidden="true" className={styles.mark} data-file={file}>
      <Image
        src={`/organizations/${file}`}
        alt=""
        width={34}
        height={28}
        unoptimized
      />
    </span>
  );
}
