import Link from "next/link";
import { ContentfulGraphQLError } from "@/lib/contentful/graphql";
import { getContentfulPages } from "@/lib/contentful/pages";
import styles from "./page.module.css";

async function loadPages() {
  try {
    return { pages: await getContentfulPages() };
  } catch (error) {
    if (error instanceof ContentfulGraphQLError) {
      return { pages: [], error: error.message };
    }

    return { pages: [], error: "No se pudo cargar la informacion de Contentful." };
  }
}

export default async function Home() {
  const { pages, error } = await loadPages();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Contentful GraphQL</p>
        <h1>11diez</h1>
        <p className={styles.description}>
          Paginas cargadas desde el GraphQL Content API de Contentful usando el
          modelo `pageCollection`.
        </p>
      </section>

      <section className={styles.contentPanel} aria-labelledby="pages-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Pages</p>
          <h2 id="pages-heading">Contenido desde Contentful</h2>
        </div>

        {error ? (
          <div className={styles.notice} role="status">
            <strong>No se pudo consultar Contentful.</strong>
            <span>{error}</span>
          </div>
        ) : null}

        {!error && pages.length === 0 ? (
          <div className={styles.notice} role="status">
            <strong>No hay paginas publicadas.</strong>
            <span>Publica contenido en Contentful para verlo aqui.</span>
          </div>
        ) : null}

        <div className={styles.pagesGrid}>
          {pages.map((page) => {
            const blocks = page.blocksCollection?.items?.filter(Boolean) ?? [];
            const assetBlocks = page.content?.links?.assets?.block?.length ?? 0;
            const assetLinks = page.content?.links?.assets?.hyperlink?.length ?? 0;
            const entryBlocks = page.content?.links?.entries?.block?.length ?? 0;

            return (
              <article className={styles.pageCard} key={page.slug ?? page.title}>
                <div>
                  <p className={styles.slug}>/{page.slug ?? "sin-slug"}</p>
                  <h3>{page.title ?? "Pagina sin titulo"}</h3>
                  {page.slug ? (
                    <Link className={styles.pageLink} href={`/${page.slug}`}>
                      Ver pagina
                    </Link>
                  ) : null}
                </div>

                <dl className={styles.metaList}>
                  <div>
                    <dt>Bloques</dt>
                    <dd>{blocks.length}</dd>
                  </div>
                  <div>
                    <dt>Assets</dt>
                    <dd>{assetBlocks + assetLinks}</dd>
                  </div>
                  <div>
                    <dt>Entries</dt>
                    <dd>{entryBlocks}</dd>
                  </div>
                </dl>

                {blocks.length > 0 ? (
                  <ul className={styles.blocksList}>
                    {blocks.map((block, index) => (
                      <li key={block?._id ?? `${page.slug}-block-${index}`}>
                        <span>{block?.title ?? "Bloque sin titulo"}</span>
                        {typeof block?.numberBlocks === "number" ? (
                          <small>#{block.numberBlocks}</small>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
