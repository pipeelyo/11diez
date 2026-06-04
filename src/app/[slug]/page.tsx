import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/rich-text";
import { getContentfulPageBySlug, getContentfulPages } from "@/lib/contentful/pages";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const pages = await getContentfulPages();

    return pages
      .map((page) => page.slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getContentfulPageBySlug({ slug });

  return {
    title: page?.title ? `${page.title} | 11diez` : "11diez",
  };
}

export default async function ContentfulPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getContentfulPageBySlug({ slug });

  if (!page) {
    notFound();
  }

  const blocks = page.blocksCollection?.items?.filter(Boolean) ?? [];

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/">
        Volver a paginas
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.slug}>/{page.slug}</p>
          <h1>{page.title}</h1>
        </header>

        <div className={styles.richText}>
          <RichTextRenderer document={page.content?.json} />
        </div>

        {blocks.length > 0 ? (
          <section className={styles.blocks} aria-labelledby="blocks-heading">
            <h2 id="blocks-heading">Bloques de la pagina</h2>
            <ul>
              {blocks.map((block, index) => (
                <li key={block?._id ?? `${page.slug}-block-${index}`}>
                  <span>{block?.title ?? "Bloque sin titulo"}</span>
                  {typeof block?.numberBlocks === "number" ? (
                    <small>#{block.numberBlocks}</small>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
