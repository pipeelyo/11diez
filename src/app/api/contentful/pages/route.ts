import { NextResponse } from "next/server";
import { ContentfulGraphQLError } from "@/lib/contentful/graphql";
import { getContentfulPages } from "@/lib/contentful/pages";

export async function GET() {
  try {
    const pages = await getContentfulPages();

    return NextResponse.json({ pages });
  } catch (error) {
    if (error instanceof ContentfulGraphQLError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: error.status ?? 500 },
      );
    }

    return NextResponse.json(
      { error: "Unexpected Contentful pages error." },
      { status: 500 },
    );
  }
}
