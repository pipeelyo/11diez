import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Next.js + TypeScript</p>
        <h1>11diez</h1>
        <p className={styles.description}>
          Base inicial lista para construir una aplicacion moderna con el App
          Router de Next.js, TypeScript y ESLint.
        </p>
        <div className={styles.actions}>
          <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
            Documentacion de Next.js
          </a>
          <a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noreferrer">
            Guia de TypeScript
          </a>
        </div>
      </section>
    </main>
  );
}
