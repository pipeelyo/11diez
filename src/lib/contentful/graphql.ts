const DEFAULT_CONTENTFUL_SPACE_ID = "w4hosymzan98";
const DEFAULT_CONTENTFUL_ENVIRONMENT_ID = "master";
const DEFAULT_CONTENTFUL_GRAPHQL_HOST = "graphql.contentful.com";

type ContentfulGraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
};

type ContentfulGraphQLRequest<TVariables> = {
  query: string;
  variables?: TVariables;
  preview?: boolean;
  next?: NextFetchRequestConfig;
};

export class ContentfulGraphQLError extends Error {
  constructor(
    message: string,
    readonly details?: ContentfulGraphQLResponse<unknown>["errors"],
    readonly status?: number,
  ) {
    super(message);
    this.name = "ContentfulGraphQLError";
  }
}

export function getContentfulGraphQLEndpoint() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID ?? DEFAULT_CONTENTFUL_SPACE_ID;
  const environmentId =
    process.env.CONTENTFUL_ENVIRONMENT_ID ?? DEFAULT_CONTENTFUL_ENVIRONMENT_ID;
  const host = process.env.CONTENTFUL_GRAPHQL_HOST ?? DEFAULT_CONTENTFUL_GRAPHQL_HOST;

  return `https://${host}/content/v1/spaces/${spaceId}/environments/${environmentId}`;
}

function getContentfulAccessToken(preview?: boolean) {
  if (preview) {
    return (
      process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ??
      process.env.CONTENTFUL_GRAPHQL_ACCESS_TOKEN ??
      process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN
    );
  }

  return (
    process.env.CONTENTFUL_GRAPHQL_ACCESS_TOKEN ??
    process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN
  );
}

export async function contentfulGraphQLFetch<
  TData,
  TVariables extends Record<string, unknown> = Record<string, never>,
>({
  query,
  variables,
  preview = false,
  next,
}: ContentfulGraphQLRequest<TVariables>) {
  const accessToken = getContentfulAccessToken(preview);

  if (!accessToken) {
    throw new ContentfulGraphQLError(
      "Missing Contentful GraphQL access token. Set CONTENTFUL_GRAPHQL_ACCESS_TOKEN or CONTENTFUL_DELIVERY_ACCESS_TOKEN.",
    );
  }

  const response = await fetch(getContentfulGraphQLEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next,
  });

  const payload = (await response.json()) as ContentfulGraphQLResponse<TData>;

  if (!response.ok || payload.errors?.length) {
    throw new ContentfulGraphQLError(
      payload.errors?.[0]?.message ?? "Contentful GraphQL request failed.",
      payload.errors,
      response.status,
    );
  }

  return payload.data as TData;
}
