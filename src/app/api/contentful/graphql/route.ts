import { NextResponse } from "next/server";
import {
  ContentfulGraphQLError,
  contentfulGraphQLFetch,
} from "@/lib/contentful/graphql";


const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID ?? "w4hosymzan98";
const CONTENTFUL_ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID ?? "master";

export async function GET() {
  const explorerUrl = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}/explore`;

  return NextResponse.json({
    message:
      "This endpoint accepts POST requests with a GraphQL query in the request body.",
    method: "POST",
    endpoint: "/api/contentful/graphql",
    example: {
      query: "query { __typename }",
    },
    contentfulGraphQLExplorer: explorerUrl,
    note: "Open the explorer URL and provide your Content Delivery API access token in Contentful's interface.",
  });
}

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  preview?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as GraphQLRequestBody;

  if (!body.query) {
    return NextResponse.json(
      { error: "Missing GraphQL query in request body." },
      { status: 400 },
    );
  }

  try {
    const data = await contentfulGraphQLFetch({
      query: body.query,
      variables: body.variables,
      preview: body.preview,
    });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof ContentfulGraphQLError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { error: "Unexpected Contentful GraphQL error." },
      { status: 500 },
    );
  }
}
