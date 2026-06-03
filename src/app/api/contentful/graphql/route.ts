import { NextResponse } from "next/server";
import {
  ContentfulGraphQLError,
  contentfulGraphQLFetch,
} from "@/lib/contentful/graphql";

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
