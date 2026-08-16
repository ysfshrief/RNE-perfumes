import styles from "./PageShell.module.css";

export default function PageShell({ eyebrow, title, lead, children }) {
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
      </div>
      <div className={`container ${styles.body}`}>{children}</div>
    </>
  );
}
