import { contentfulGraphQLFetch } from "./graphql";

export const CONTENTFUL_PAGES_QUERY = /* GraphQL */ `
  query GetPages($limit: Int = 10, $blocksLimit: Int = 10) {
    pageCollection(limit: $limit) {
      items {
        slug
        title
        content {
          json
          links {
            assets {
              block {
                contentType
              }
              hyperlink {
                contentType
                url
              }
            }
            entries {
              block {
                __typename
              }
            }
          }
        }
        blocksCollection(limit: $blocksLimit) {
          __typename
          items {
            _id
            title
            numberBlocks
          }
        }
      }
    }
  }
`;

type RichTextLinks = {
  assets?: {
    block?: Array<{ contentType?: string | null } | null> | null;
    hyperlink?: Array<{ contentType?: string | null; url?: string | null } | null> | null;
  } | null;
  entries?: {
    block?: Array<{ __typename?: string | null } | null> | null;
  } | null;
};

export type ContentfulPageBlock = {
  _id?: string | null;
  title?: string | null;
  numberBlocks?: number | null;
};

export type ContentfulPage = {
  slug?: string | null;
  title?: string | null;
  content?: {
    json?: unknown;
    links?: RichTextLinks | null;
  } | null;
  blocksCollection?: {
    __typename?: string | null;
    items?: Array<ContentfulPageBlock | null> | null;
  } | null;
};

type ContentfulPagesResponse = {
  pageCollection?: {
    items?: Array<ContentfulPage | null> | null;
  } | null;
};

type GetContentfulPagesOptions = {
  limit?: number;
  blocksLimit?: number;
  preview?: boolean;
};

export async function getContentfulPages({
  limit = 10,
  blocksLimit = 10,
  preview = false,
}: GetContentfulPagesOptions = {}) {
  const data = await contentfulGraphQLFetch<
    ContentfulPagesResponse,
    { limit: number; blocksLimit: number }
  >({
    query: CONTENTFUL_PAGES_QUERY,
    variables: { limit, blocksLimit },
    preview,
    next: { revalidate: 60 },
  });

  return data.pageCollection?.items?.filter((page): page is ContentfulPage => Boolean(page)) ?? [];
}


export const CONTENTFUL_PAGE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetPageBySlug($slug: String!, $blocksLimit: Int = 10) {
    pageCollection(where: { slug: $slug }, limit: 1) {
      items {
        slug
        title
        content {
          json
          links {
            assets {
              block {
                contentType
              }
              hyperlink {
                contentType
                url
              }
            }
            entries {
              block {
                __typename
              }
            }
          }
        }
        blocksCollection(limit: $blocksLimit) {
          __typename
          items {
            _id
            title
            numberBlocks
          }
        }
      }
    }
  }
`;

type GetContentfulPageBySlugOptions = {
  slug: string;
  blocksLimit?: number;
  preview?: boolean;
};

export async function getContentfulPageBySlug({
  slug,
  blocksLimit = 10,
  preview = false,
}: GetContentfulPageBySlugOptions) {
  const data = await contentfulGraphQLFetch<
    ContentfulPagesResponse,
    { slug: string; blocksLimit: number }
  >({
    query: CONTENTFUL_PAGE_BY_SLUG_QUERY,
    variables: { slug, blocksLimit },
    preview,
    next: { revalidate: 60 },
  });

  return data.pageCollection?.items?.find(Boolean) ?? null;
}
