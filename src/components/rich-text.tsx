import type { ReactNode } from "react";

type RichTextMark = { type?: string };

type RichTextNode = {
  nodeType?: string;
  value?: string;
  marks?: RichTextMark[];
  data?: {
    uri?: string;
    target?: {
      sys?: { id?: string };
    };
  };
  content?: RichTextNode[];
};

type RichTextRendererProps = {
  document?: unknown;
};

function renderChildren(node: RichTextNode, keyPrefix: string) {
  return node.content?.map((child, index) => renderNode(child, `${keyPrefix}-${index}`)) ?? null;
}

function renderText(node: RichTextNode, key: string) {
  let value: ReactNode = node.value ?? "";

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") {
      value = <strong key={`${key}-bold`}>{value}</strong>;
    }

    if (mark.type === "italic") {
      value = <em key={`${key}-italic`}>{value}</em>;
    }

    if (mark.type === "underline") {
      value = <u key={`${key}-underline`}>{value}</u>;
    }

    if (mark.type === "code") {
      value = <code key={`${key}-code`}>{value}</code>;
    }
  }

  return <span key={key}>{value}</span>;
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  switch (node.nodeType) {
    case "document":
      return <>{renderChildren(node, key)}</>;
    case "paragraph":
      return <p key={key}>{renderChildren(node, key)}</p>;
    case "heading-1":
      return <h1 key={key}>{renderChildren(node, key)}</h1>;
    case "heading-2":
      return <h2 key={key}>{renderChildren(node, key)}</h2>;
    case "heading-3":
      return <h3 key={key}>{renderChildren(node, key)}</h3>;
    case "heading-4":
      return <h4 key={key}>{renderChildren(node, key)}</h4>;
    case "heading-5":
      return <h5 key={key}>{renderChildren(node, key)}</h5>;
    case "heading-6":
      return <h6 key={key}>{renderChildren(node, key)}</h6>;
    case "unordered-list":
      return <ul key={key}>{renderChildren(node, key)}</ul>;
    case "ordered-list":
      return <ol key={key}>{renderChildren(node, key)}</ol>;
    case "list-item":
      return <li key={key}>{renderChildren(node, key)}</li>;
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node, key)}</blockquote>;
    case "hr":
      return <hr key={key} />;
    case "hyperlink":
      return (
        <a key={key} href={node.data?.uri} rel="noreferrer" target="_blank">
          {renderChildren(node, key)}
        </a>
      );
    case "embedded-entry-block":
      return (
        <aside key={key}>
          Bloque embebido: {node.data?.target?.sys?.id ?? "sin referencia"}
        </aside>
      );
    case "embedded-asset-block":
      return (
        <aside key={key}>
          Asset embebido: {node.data?.target?.sys?.id ?? "sin referencia"}
        </aside>
      );
    case "text":
      return renderText(node, key);
    default:
      return renderChildren(node, key);
  }
}

export function RichTextRenderer({ document }: RichTextRendererProps) {
  if (!document || typeof document !== "object") {
    return null;
  }

  return <>{renderNode(document as RichTextNode, "rich-text")}</>;
}
