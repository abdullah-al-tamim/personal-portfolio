import Image from "next/image";
import styles from "./PortfolioMarks.module.css";

const paths = {
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
